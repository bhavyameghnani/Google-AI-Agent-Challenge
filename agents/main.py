"""Main API server for Company Data Extraction with Citations and Competitor Analysis with Scoring using Google ADK"""

import json
import logging
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import dotenv
import firebase_admin
import fitz
from competitor_analysis_agent.agent import (
    competitor_analysis_agent,
)
from competitor_analysis_agent.models import (
    AllCompetitorsInfoWithScore,
)
from evaluation_score.agent import final_evaluation_score_agent
from evaluation_score.models import EvaluationScoreComplete
from fact_check_agent.agent import root_agent as fact_check_root
from fact_check_agent.models import FactCheckReport
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from models import (
    CompanyListItem,
    CompanyRequest,
    CompanyResponse,
    CompetitorResponse,
    HealthResponse,
    CompanyListResponse,
    StatsResponse,
)

# Import your enhanced ADK agent with citations
from research_agent.agent import root_agent
from research_agent.models import CompanyProfile

dotenv.load_dotenv()

logger = logging.getLogger(__name__)


if not os.getenv("GOOGLE_API_KEY"):
    logger.info("WARNING: GOOGLE_API_KEY not found in environment variables")
    logger.info("Please add GOOGLE_API_KEY to your .env file")


# Initialize FastAPI app
app = FastAPI(
    title="Company Data Extraction API with Citations",
    description="Extract comprehensive company data with source citations using Google ADK",
    version="2.0.0",
)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOCAL_RUN = os.getenv("LOCAL_RUN", "false").lower() == "true"

if LOCAL_RUN:
    # Initialize Firebase
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
        "ai-agent-company-data-firebase-adminsdk-creds.json"
    )
    logger.info("⚠️ Running in LOCAL_RUN mode with local Firebase credentials")

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)

db = firestore.client()
companies_ref = db.collection("companies")
competitors_ref = db.collection("company_competitors")
logs_ref = db.collection("extraction_logs")

# --- Pydantic Models ---


# --- Helper Functions ---


def validate_company_name(company_name: str) -> tuple[bool, str]:
    """Validate company name input"""
    if not company_name or not company_name.strip():
        return False, "Company name is required"
    if len(company_name.strip()) < 2:
        return False, "Company name must be at least 2 characters"
    return True, ""


def serialize_company_data(company_data: CompanyProfile) -> Dict[str, Any]:
    """Convert CompanyProfile to Firebase-compatible dict"""
    try:
        # Convert Pydantic model to dict with proper serialization
        return company_data.model_dump()
    except AttributeError:
        # Fallback for older Pydantic versions
        return company_data.dict()


def deserialize_company_data(data_dict: Dict[str, Any]) -> CompanyProfile:
    """Convert Firebase dict back to CompanyProfile"""
    try:
        return CompanyProfile(**data_dict)
    except Exception as e:
        logger.info(f"Error deserializing company data: {e}")
        # Try to handle partial data gracefully
        raise ValueError(f"Invalid company data structure: {e}")


def get_company_from_firebase(company_name: str) -> Optional[Dict[str, Any]]:
    """Get company data from Firebase"""
    try:
        doc_id = company_name.lower().replace(" ", "_")
        doc = companies_ref.document(doc_id).get()

        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        logger.info(f"Error reading from Firebase: {e}")
        return None


def get_competitors_from_firebase(company_name: str) -> Optional[Dict[str, Any]]:
    """Get company data from Firebase"""
    try:
        doc_id = company_name.lower().replace(" ", "_")
        doc = competitors_ref.document(doc_id).get()

        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        logger.info(f"Error reading from Firebase: {e}")
        return None


def save_company_to_firebase(company_name: str, company_data: CompanyProfile) -> bool:
    """Save company data to Firebase with proper serialization"""
    try:
        doc_id = company_name.lower().replace(" ", "_")

        # Serialize the enhanced company data
        serialized_data = serialize_company_data(company_data)

        document_data = {
            "company_name": company_name,
            "last_updated": datetime.now(timezone.utc),
            "extraction_status": "completed",
            "created_at": firestore.SERVER_TIMESTAMP,
            "data": serialized_data,
        }

        companies_ref.document(doc_id).set(document_data)
        logger.info(f"✅ Saved {company_name} to Firebase with citations")
        return True

    except Exception as e:
        logger.info(f"❌ Error saving to Firebase: {e}")
        return False


def save_company_competitors_to_firebase(
    company_name: str, competitor_data: AllCompetitorsInfoWithScore
) -> bool:
    """Save company competitors data to Firebase with proper serialization"""
    try:
        doc_id = company_name.lower().replace(" ", "_")

        # Serialize the enhanced company data
        serialized_data = competitor_data.model_dump()

        document_data = {
            "company_name": company_name,
            "last_updated": datetime.now(timezone.utc),
            "extraction_status": "completed",
            "created_at": firestore.SERVER_TIMESTAMP,
            "data": serialized_data,
        }

        competitors_ref.document(doc_id).set(document_data)
        logger.info(f"✅ Saved {company_name} competitors to Firebase with citations")
        return True

    except Exception as e:
        logger.info(f"❌ Error saving to Firebase: {e}")
        return False


def log_extraction_attempt(
    company_name: str,
    status: str,
    duration: Optional[float] = None,
    error: Optional[str] = None,
):
    """Log extraction attempt to Firebase"""
    try:
        log_data = {
            "company_name": company_name,
            "timestamp": datetime.now(timezone.utc),
            "status": status,  # 'started', 'completed', 'failed'
            "duration_seconds": duration,
            "error_message": error,
            "created_at": firestore.SERVER_TIMESTAMP,
        }

        logs_ref.add(log_data)
    except Exception as e:
        logger.info(f"Error logging to Firebase: {e}")


def is_data_fresh(last_updated, max_age_days: int = 30) -> bool:
    """Check if data is fresh enough"""
    if not last_updated:
        return False

    try:
        # Firestore Timestamp → Python datetime
        if hasattr(last_updated, "to_datetime"):
            updated_date = last_updated.to_datetime()
        elif isinstance(last_updated, datetime):
            updated_date = last_updated
        else:
            updated_date = datetime.fromisoformat(str(last_updated).replace("Z", ""))

        # Ensure timezone-aware
        if updated_date.tzinfo is None:
            updated_date = updated_date.replace(tzinfo=timezone.utc)

        age = datetime.now(timezone.utc) - updated_date
        return age.days < max_age_days
    except Exception as e:
        logger.info(f"⚠️ is_data_fresh error: {e}")
        return False


async def extract_company_data_with_adk(company_name: str) -> CompanyProfile:
    """Extract company data using the enhanced ADK agent with citations"""

    start_time = datetime.now(timezone.utc)
    log_extraction_attempt(company_name, "started")

    session_service = InMemorySessionService()
    runner = Runner(
        agent=root_agent, app_name="company_extraction", session_service=session_service
    )
    session_id = f"extract_{uuid.uuid4().hex[:8]}"

    await session_service.create_session(
        app_name="company_extraction", user_id="api_user", session_id=session_id
    )

    content = types.Content(role="user", parts=[types.Part(text=company_name)])

    logger.info(
        f"🤖 Starting enhanced ADK extraction with citations for: {company_name}"
    )
    try:
        # Run the agent and collect all events into a list
        events = [
            event
            for event in runner.run(
                user_id="api_user",
                session_id=session_id,
                new_message=content,
            )
        ]

        # The final result is the very last event
        final_event = events[-1] if events else None

        if (
            final_event
            and final_event.is_final_response()
            and final_event.content
            and final_event.content.parts
        ):
            logger.info("✅ Final JSON event with citations received from agent.")
            json_string = final_event.content.parts[0].text

            try:
                final_structured_output = json.loads(json_string)
                company_profile = CompanyProfile(**final_structured_output)

                duration = (datetime.now(timezone.utc) - start_time).total_seconds()
                log_extraction_attempt(company_name, "completed", duration)
                logger.info(
                    f"✅ Enhanced ADK extraction completed for: {company_name} ({duration:.1f}s)"
                )
                return company_profile

            except json.JSONDecodeError as e:
                raise Exception(f"Invalid JSON response from agent: {e}")
            except Exception as e:
                raise Exception(f"Failed to parse company profile: {e}")
        else:
            # If for some reason there's no final event, raise an error
            raise Exception("Agent did not produce a valid final response.")

    except Exception as e:
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        log_extraction_attempt(company_name, "failed", duration, str(e))
        logger.info(f"❌ Enhanced ADK extraction failed for: {company_name} - {e}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")
    finally:
        logger.info(f"🧹 Finished processing for session: {session_id}")
        session_service = None
        logger.info(f"✅ Session cleanup completed for: {session_id}")


async def evaluation_score_with_adk(company_name: str) -> EvaluationScoreComplete:
    """Fetch evaluation score using the enhanced ADK agent"""

    session_service = InMemorySessionService()
    runner = Runner(
        agent=final_evaluation_score_agent,
        app_name="evaluation_score",
        session_service=session_service,
    )
    session_id = f"evaluation_score_{uuid.uuid4().hex[:8]}"

    await session_service.create_session(
        app_name="evaluation_score", user_id="api_user", session_id=session_id
    )

    content = types.Content(role="user", parts=[types.Part(text=company_name)])

    logger.info(f"🤖 Starting enhanced ADK evaluation_score for: {company_name}")
    try:
        # Run the agent and collect all events into a list
        events = [
            event
            for event in runner.run(
                user_id="api_user",
                session_id=session_id,
                new_message=content,
            )
        ]

        # The final result is the very last event
        final_event = events[-1] if events else None

        if (
            final_event
            and final_event.is_final_response()
            and final_event.content
            and final_event.content.parts
        ):
            logger.info("✅ Final JSON event with citations received from agent.")
            json_string = final_event.content.parts[0].text

            try:
                final_structured_output = json.loads(json_string)
                evaluation_score = EvaluationScoreComplete(**final_structured_output)

                logger.info(
                    f"✅ Enhanced ADK evaluation_score completed for: {company_name}"
                )
                return evaluation_score

            except json.JSONDecodeError as e:
                raise Exception(f"Invalid JSON response from agent: {e}")
            except Exception as e:
                raise Exception(f"Failed to parse company profile: {e}")
        else:
            # If for some reason there's no final event, raise an error
            raise Exception("Agent did not produce a valid final response.")
    finally:
        logger.info(f"🧹 Finished processing for session: {session_id}")
        session_service = None
        logger.info(f"✅ Session cleanup completed for: {session_id}")


async def competitor_analysis_with_adk(
    company_name: str,
) -> AllCompetitorsInfoWithScore:
    """Fetch competitor analysis using the enhanced ADK agent"""

    session_service = InMemorySessionService()
    runner = Runner(
        agent=competitor_analysis_agent,
        app_name="competitor_analysis",
        session_service=session_service,
    )
    session_id = f"competitor_analysis_{uuid.uuid4().hex[:8]}"

    await session_service.create_session(
        app_name="competitor_analysis", user_id="api_user", session_id=session_id
    )

    content = types.Content(role="user", parts=[types.Part(text=company_name)])

    logger.info(f"🤖 Starting enhanced ADK competitor_analysis for: {company_name}")
    try:
        # Run the agent and collect all events into a list
        events = [
            event
            for event in runner.run(
                user_id="api_user",
                session_id=session_id,
                new_message=content,
            )
        ]

        # The final result is the very last event
        final_event = events[-1] if events else None

        if (
            final_event
            and final_event.is_final_response()
            and final_event.content
            and final_event.content.parts
        ):
            logger.info("✅ Final JSON event with citations received from agent.")
            json_string = final_event.content.parts[0].text

            try:
                final_structured_output = json.loads(json_string)
                all_competitor_info = AllCompetitorsInfoWithScore(
                    **final_structured_output
                )

                logger.info(
                    f"✅ Enhanced ADK competitor analysis completed for: {company_name}"
                )
                return all_competitor_info

            except json.JSONDecodeError as e:
                raise Exception(f"Invalid JSON response from agent: {e}")
            except Exception as e:
                raise Exception(f"Failed to parse company profile: {e}")
        else:
            # If for some reason there's no final event, raise an error
            raise Exception("Agent did not produce a valid final response.")
    finally:
        logger.info(f"🧹 Finished processing for session: {session_id}")
        session_service = None
        logger.info(f"✅ Session cleanup completed for: {session_id}")


# --- API Routes ---


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        message="Company Data Extraction API with Citations is running!",
        status="healthy",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/extract", response_model=CompanyResponse)
async def extract_company(request: CompanyRequest):
    """
    Main endpoint: Extract company data with citations and Firebase caching

    - Checks Firebase cache first
    - Extracts fresh data with citations if cache is stale/missing
    - Returns structured company profile with source citations
    """
    company_name = request.company_name.strip()

    # Validate input
    is_valid, error_msg = validate_company_name(company_name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # Check Firebase cache first
    logger.info(f"🗄️ Checking cache for: {company_name}")
    cached_data = get_company_from_firebase(company_name)

    if cached_data and is_data_fresh(cached_data.get("last_updated")):
        # Return cached data with citations
        cache_age = (datetime.now(timezone.utc) - cached_data["last_updated"]).days
        logger.info(f"🗄️ Returning cached data with citations for: {company_name}")

        try:
            company_profile = deserialize_company_data(cached_data["data"])
        except ValueError as e:
            logger.info(f"⚠️ Cached data corrupted, re-extracting: {e}")
            # If cached data is corrupted, extract fresh data
            company_profile = await extract_company_data_with_adk(company_name)
            save_company_to_firebase(company_name, company_profile)

            return CompanyResponse(
                company_name=company_name,
                data=company_profile,
                source="extraction",  # Was corrupted, so extracted fresh
                last_updated=datetime.now(timezone.utc).isoformat(),
                cache_age_days=0,
                extraction_status="completed",
            )

        return CompanyResponse(
            company_name=company_name,
            data=company_profile,
            source="database",
            last_updated=cached_data["last_updated"].isoformat(),
            cache_age_days=cache_age,
            extraction_status=cached_data.get("extraction_status", "completed"),
        )

    # Extract fresh data using enhanced ADK agent
    logger.info(f"🔍 Extracting fresh data with citations for: {company_name}")
    company_profile = await extract_company_data_with_adk(company_name)

    # Save to Firebase
    save_success = save_company_to_firebase(company_name, company_profile)

    if not save_success:
        logger.info("⚠️ Warning: Failed to save to Firebase, but extraction succeeded")

    return CompanyResponse(
        company_name=company_name,
        data=company_profile,
        source="extraction",
        last_updated=datetime.now(timezone.utc).isoformat(),
        cache_age_days=0,
        extraction_status="completed",
    )


@app.post("/fact-check", response_model=FactCheckReport)
async def fact_check_pdf(file: UploadFile = File(...)):
    """Accept a PDF upload, extract text, run the fact-check agent pipeline, and return a structured report."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Save uploaded file temporarily
    tmp_path = f"temp_{uuid.uuid4().hex}.pdf"
    logger.info(f"Saving uploaded file to temporary path: {tmp_path}")
    with open(tmp_path, "wb") as f:
        f.write(await file.read())
    logger.info(f"File saved: {tmp_path}")
    try:
        try:
            logger.info(f"Extracting text from PDF: {tmp_path}")
            # Extract text from PDF using PyMuPDF (fitz)
            doc = fitz.open(tmp_path)
            full_text = []
            for page in doc:
                text = page.get_text("text")
                # include page markers for traceability
                full_text.append(f"[PAGE {page.number + 1}]\n" + text)
            doc.close()

            combined_text = "\n\n".join(full_text)
            logger.info(f"Extracted text length: {len(combined_text)} characters")
            logger.info(
                "Text extraction completed. Running fact-check agent pipeline..."
            )

            # Run the ADK agent pipeline (reuse Runner pattern used elsewhere)
            session_service = InMemorySessionService()
            runner = Runner(
                agent=fact_check_root,
                app_name="fact_check",
                session_service=session_service,
            )
            session_id = f"factcheck_{uuid.uuid4().hex[:8]}"

            await session_service.create_session(
                app_name="fact_check", user_id="api_user", session_id=session_id
            )

            content = types.Content(role="user", parts=[types.Part(text=combined_text)])

            # Collect events
            events = [
                event
                for event in runner.run(
                    user_id="api_user", session_id=session_id, new_message=content
                )
            ]
            final_event = events[-1] if events else None

            if (
                final_event
                and final_event.is_final_response()
                and final_event.content
                and final_event.content.parts
            ):
                # Expect agent to return JSON string representing the fact-check report
                json_string = final_event.content.parts[0].text

                if not json_string or not json_string.strip():
                    # Agent returned an empty response (often due to LLM errors like rate limiting or overload)
                    logger.info(
                        "⚠️ Agent returned empty final content. Possible model error or overload."
                    )
                    # Try to extract any error text from the final_event
                    try:
                        logger.info("Final event object:", repr(final_event))
                    except Exception:
                        pass
                    raise HTTPException(
                        status_code=503,
                        detail="Model did not return a response (possibly overloaded). Please retry later.",
                    )

                try:
                    report_obj = json.loads(json_string)
                except json.JSONDecodeError:
                    # Log the invalid JSON for debugging and attempt to salvage a JSON substring
                    logger.info(
                        "⚠️ Agent returned non-JSON response (attempting to salvage JSON):"
                    )
                    logger.info(json_string[:2000])

                    # Try to extract a JSON array or object substring from the returned text
                    import re

                    def try_extract_json(s: str):
                        # Search for a JSON array first
                        start = s.find("[")
                        if start != -1:
                            # Try progressively smaller end positions to find a valid JSON array
                            for end in range(len(s) - 1, start - 1, -1):
                                if s[end] == "]":
                                    candidate = s[start : end + 1]
                                    try:
                                        return json.loads(candidate)
                                    except Exception:
                                        continue

                        # Search for a JSON object as a fallback
                        start = s.find("{")
                        if start != -1:
                            for end in range(len(s) - 1, start - 1, -1):
                                if s[end] == "}":
                                    candidate = s[start : end + 1]
                                    try:
                                        return json.loads(candidate)
                                    except Exception:
                                        continue

                        return None

                    salvaged = try_extract_json(json_string)
                    if salvaged is not None:
                        logger.info("✅ Successfully salvaged JSON from agent output")
                        report_obj = salvaged
                        # If agent returned a list of results (legacy format), convert it
                        # to the expected FactCheckReport mapping: {"claims": [FactCheckResult,...]}
                        if isinstance(report_obj, list):
                            transformed = {"claims": []}
                            for item in report_obj:
                                # normalize fields
                                claim_id = item.get("claim_id") or item.get("id")
                                # Ensure id is a string for Pydantic
                                if claim_id is not None:
                                    claim_id = (
                                        str(claim_id) if claim_id is not None else ""
                                    )

                                claim_text = (
                                    item.get("claim_text")
                                    or item.get("claim")
                                    or item.get("text")
                                    or ""
                                )
                                claim_text = (
                                    str(claim_text) if claim_text is not None else ""
                                )

                                # map supporting evidence urls to EvidenceItem-like dicts
                                supporting = (
                                    item.get("supporting_evidence")
                                    or item.get("supporting_evidences")
                                    or []
                                )
                                evidences = []
                                for ev in supporting:
                                    if isinstance(ev, dict):
                                        evidences.append(
                                            {
                                                "url": ev.get("url"),
                                                "title": ev.get("title"),
                                                "snippet": ev.get("snippet"),
                                            }
                                        )
                                    else:
                                        evidences.append({"url": ev})

                                transformed["claims"].append(
                                    {
                                        "claim": {"id": claim_id, "text": claim_text},
                                        "verdict": item.get("verdict")
                                        or "Unsubstantiated",
                                        "evidences": evidences,
                                        "corrected_value": item.get("corrected_claim")
                                        or item.get("corrected_value"),
                                        "reasoning": item.get("reasoning"),
                                    }
                                )

                            report_obj = transformed
                    else:
                        # Could not salvage JSON — fallback to empty claims array
                        logger.info(
                            "❌ Could not salvage JSON. Returning empty claims array."
                        )
                        return FactCheckReport(claims=[])

                # Return using Pydantic model validation
                return FactCheckReport(**report_obj)
            else:
                # Backend fallback: return empty claims array if agent output is not valid JSON
                logger.info(
                    "❌ Agent did not produce a valid final response. Returning empty claims array."
                )
                return FactCheckReport(claims=[])

        except Exception as e:
            # Print full traceback to server console for debugging
            import traceback

            traceback.print_exc()
            # Return a controlled error to the client (preserves CORS headers)
            raise HTTPException(
                status_code=500, detail=f"Server error: {type(e).__name__}: {e}"
            )

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/competitor-analysis", response_model=CompetitorResponse)
async def competitor_analysis(request: CompanyRequest):
    """
    Main endpoint: Extract company data with citations and Firebase caching

    - Checks Firebase cache first
    - Extracts fresh data with citations if cache is stale/missing
    - Returns structured company profile with source citations
    """
    company_name = request.company_name.strip()

    # Validate input
    is_valid, error_msg = validate_company_name(company_name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # Check Firebase cache first
    logger.info(f"🗄️ Checking cache for: {company_name}")
    cached_data = get_competitors_from_firebase(company_name)
    # cached_data = None  # Disable caching for competitor analysis for now

    if cached_data and is_data_fresh(cached_data.get("last_updated")):
        # Return cached data with citations
        cache_age = (datetime.now(timezone.utc) - cached_data["last_updated"]).days
        logger.info(f"🗄️ Returning cached data with citations for: {company_name}")

        try:
            competitor_data = AllCompetitorsInfoWithScore(**cached_data["data"])
        except ValueError as e:
            logger.info(f"⚠️ Cached data corrupted, re-extracting: {e}")
            # If cached data is corrupted, extract fresh data
            competitor_data = await competitor_analysis_with_adk(company_name)
            save_company_competitors_to_firebase(company_name, competitor_data)

            return CompetitorResponse(
                company_name=company_name,
                data=competitor_data,
                source="extraction",  # Was corrupted, so extracted fresh
                last_updated=datetime.now(timezone.utc).isoformat(),
                cache_age_days=0,
                extraction_status="completed",
            )

        return CompetitorResponse(
            company_name=company_name,
            data=competitor_data,
            source="database",
            last_updated=cached_data["last_updated"].isoformat(),
            cache_age_days=cache_age,
            extraction_status=cached_data.get("extraction_status", "completed"),
        )

    # Extract fresh data using enhanced ADK agent
    logger.info(f"🔍 Finding competitor data for: {company_name}")
    competitor_analysis = await competitor_analysis_with_adk(company_name)

    # Save to Firebase
    save_success = save_company_competitors_to_firebase(
        company_name, competitor_analysis
    )

    if not save_success:
        logger.info("⚠️ Warning: Failed to save to Firebase, but extraction succeeded")

    return CompetitorResponse(
        company_name=company_name,
        data=competitor_analysis,
        source="extraction",
        last_updated=datetime.now(timezone.utc).isoformat(),
        cache_age_days=0,
        extraction_status="completed",
    )


@app.get("/companies", response_model=CompanyListResponse)
async def list_companies():
    """
    List all companies in the database

    Returns list of all cached companies with metadata
    """
    try:
        companies = []
        docs = companies_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            cache_age = (
                (datetime.now(timezone.utc) - data["last_updated"]).days
                if data.get("last_updated")
                else None
            )

            companies.append(
                CompanyListItem(
                    company_name=data.get("company_name", "Unknown"),
                    industry_sector=data.get("data", {})
                    .get("company_info", {})
                    .get("industry_sector"),
                    year_founded=data.get("data", {})
                    .get("company_info", {})
                    .get("year_founded"),
                    headquarters_location=data.get("data", {})
                    .get("company_info", {})
                    .get("headquarters_location"),
                    latest_valuation=data.get("data", {})
                    .get("financial_data", {})
                    .get("valuation", {})
                    .get("value"),
                    last_updated=(
                        data["last_updated"].isoformat()
                        if data.get("last_updated")
                        else None
                    ),
                    cache_age_days=cache_age,
                    extraction_status=data.get("extraction_status", "unknown"),
                    is_fresh=is_data_fresh(data.get("last_updated")),
                )
            )

        return CompanyListResponse(total_companies=len(companies), companies=companies)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """
    Get database and extraction statistics

    Returns statistics about cached companies and recent extractions
    """
    try:
        # Get all companies
        all_companies = list(companies_ref.stream())
        total_count = len(all_companies)

        # Count fresh data
        fresh_count = 0
        recent_count = 0  # Last 7 days

        for doc in all_companies:
            data = doc.to_dict()
            last_updated = data.get("last_updated")

            if is_data_fresh(last_updated, 30):
                fresh_count += 1
            if is_data_fresh(last_updated, 7):
                recent_count += 1

        # Get recent extraction logs
        recent_logs = logs_ref.where(
            "timestamp", ">=", datetime.now(timezone.utc) - timedelta(days=7)
        ).stream()
        recent_extractions = len(list(recent_logs))

        cache_hit_rate = (
            f"{(fresh_count / total_count * 100):.1f}%" if total_count > 0 else "0%"
        )

        return StatsResponse(
            total_companies=total_count,
            fresh_data_count=fresh_count,
            recent_extractions_7d=recent_count,
            extraction_attempts_7d=recent_extractions,
            cache_hit_rate=cache_hit_rate,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/company/{company_name}", response_model=CompanyResponse)
async def get_company(company_name: str):
    """
    Get company data from Firebase cache only (no extraction)

    Returns cached company data with citations or 404 if not found
    """
    # Validate input
    is_valid, error_msg = validate_company_name(company_name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    cached_data = get_company_from_firebase(company_name)

    if not cached_data:
        raise HTTPException(status_code=404, detail="Company not found in database")

    cache_age = (datetime.now(timezone.utc) - cached_data["last_updated"]).days

    try:
        company_profile = deserialize_company_data(cached_data["data"])
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Cached data corrupted: {e}")

    return CompanyResponse(
        company_name=company_name,
        data=company_profile,
        source="database",
        last_updated=cached_data["last_updated"].isoformat(),
        cache_age_days=cache_age,
        extraction_status=cached_data.get("extraction_status", "completed"),
    )


# --- Run Server ---
if __name__ == "__main__":
    import uvicorn

    if LOCAL_RUN:

        host = "127.0.0.1"
    else:
        host = "0.0.0.0"

    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host=host, port=port)
