"""
LVX Startup Analysis & Newsletter API v2.0
API for generating startup analysis podcasts and sector newsletters
Powered by Let's Venture Platform
Integrated with Firebase Storage & Firestore
"""

import dotenv
import json
import os
import uuid
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Tuple, Optional

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from google import genai
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# Firebase imports
import firebase_admin
from firebase_admin import credentials, firestore, storage

# Import agents
from startup_agent import (
    root_agent,
    pdf_analysis_agent,
)
from newsletter_agent import (
    newsletter_agent,
    VALID_SECTORS
)

dotenv.load_dotenv()

LOCAL_RUN = os.getenv("LOCAL_RUN", "false").lower() == "true"


if not os.getenv('GOOGLE_API_KEY'):
    print("WARNING: GOOGLE_API_KEY not found in environment variables")
    print("Please add GOOGLE_API_KEY to your .env file")

# --- Firebase Initialization ---

if LOCAL_RUN:
    SERVICE_ACCOUNT_FILE = "serviceAccountKey.json"
    STORAGE_BUCKET = "senseai-podcast.firebasestorage.app"

    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print("WARNING: serviceAccountKey.json not found. Firebase features will be disabled.")
        FIREBASE_ENABLED = False
        db = None
        bucket = None
    else:
        try:
            cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {
                    "storageBucket": STORAGE_BUCKET
                })
            db = firestore.client()
            bucket = storage.bucket()
            FIREBASE_ENABLED = True
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"WARNING: Firebase initialization failed: {e}")
            FIREBASE_ENABLED = False
            db = None
            bucket = None
else:
    # ---- GCP Environment ----
    STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "sense-ai-podcasts")
    
    try:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        bucket = storage.bucket(STORAGE_BUCKET)
        FIREBASE_ENABLED = True
        print("✅ Firebase initialized successfully")
    except Exception as e:
        print(f"WARNING: Firebase initialization failed: {e}")
        FIREBASE_ENABLED = False
        db = None
        bucket = None

# Create output folders
PODCASTS_FOLDER = Path("startup_podcasts")
NEWSLETTERS_FOLDER = Path("sector_newsletters")
PODCASTS_FOLDER.mkdir(exist_ok=True)
NEWSLETTERS_FOLDER.mkdir(exist_ok=True)

# Initialize FastAPI
app = FastAPI(
    title="LVX Startup Analysis & Newsletter Generator",
    description="Generate investment-grade startup analysis and sector newsletters for Let's Venture Platform",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class StartupAnalysisRequest(BaseModel):
    """Request to generate startup analysis podcast."""
    startup_name: str = Field(..., description="Indian startup name to analyze")


class SectorNewsletterRequest(BaseModel):
    """Request to generate sector newsletter and podcast."""
    sector: str = Field(..., description=f"Sector name. Valid options: {', '.join(VALID_SECTORS)}")


class PodcastResponse(BaseModel):
    """Response with podcast files and metadata."""
    status: str
    message: str
    session_id: str
    startup_name: str
    files: dict
    generated_at: str
    firebase_uploaded: Optional[bool] = False
    firebase_record_id: Optional[str] = None


class NewsletterResponse(BaseModel):
    """Response for sector newsletter generation."""
    status: str
    message: str
    session_id: str
    sector: str
    files: dict
    generated_at: str
    firebase_uploaded: Optional[bool] = False
    firebase_record_id: Optional[str] = None


class PDFAnalysisResponse(BaseModel):
    """Response for PDF-based startup analysis."""
    status: str
    message: str
    session_id: str
    pdf_filename: str
    files: dict
    generated_at: str
    firebase_uploaded: Optional[bool] = False
    firebase_record_id: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    message: str
    version: str
    platform: str
    firebase_enabled: bool
    timestamp: str


# --- Firebase Helper Functions ---
async def upload_to_firebase(
    session_id: str,
    session_folder: Path,
    title: str,
    description: str,
    theme: str,
    content_type: str  # "startup_analysis" or "sector_newsletter"
) -> Tuple[bool, Optional[str]]:
    """Upload generated files to Firebase Storage and create Firestore record."""
    if not FIREBASE_ENABLED:
        return False, None
    
    try:
        record_id = str(uuid.uuid4())
        
        # Define file mappings based on content type
        if content_type == "startup_analysis":
            english_audio = session_folder / f"{session_id}_podcast_english.wav"
            hindi_audio = session_folder / f"{session_id}_podcast_hindi.wav"
            report_md = session_folder / f"{session_id}_analysis.md"
            summary_md = session_folder / f"{session_id}_summary.md"
        else:  # sector_newsletter
            english_audio = session_folder / f"{session_id}_newsletter_english.wav"
            hindi_audio = session_folder / f"{session_id}_newsletter_hindi.wav"
            report_md = session_folder / "sector_newsletter.md"
            summary_md = None
        
        async def _upload_file(local_path: Path, firebase_filename: str):
            if not local_path or not local_path.exists():
                return None
            
            blob_path = f"records/{record_id}/{firebase_filename}"
            blob = bucket.blob(blob_path)
            
            with open(local_path, "rb") as f:
                blob.upload_from_file(f, content_type=_get_content_type(firebase_filename))
            
            try:
                blob.make_public()
            except Exception:
                pass
            
            return {
                "filename": firebase_filename,
                "storage_path": blob_path,
                "content_type": _get_content_type(firebase_filename),
                "public_url": blob.public_url
            }
        
        def _get_content_type(filename: str) -> str:
            if filename.endswith(".wav"):
                return "audio/wav"
            elif filename.endswith(".md"):
                return "text/markdown"
            elif filename.endswith(".pdf"):
                return "application/pdf"
            return "application/octet-stream"
        
        # Upload files
        english_info = await _upload_file(english_audio, "audio_english.wav")
        hindi_info = await _upload_file(hindi_audio, "audio_hindi.wav")
        report_info = await _upload_file(report_md, "report.md")
        summary_info = await _upload_file(summary_md, "summary.md") if summary_md else None
        
        # Create Firestore record
        record_data = {
            "id": record_id,
            "title": title,
            "description": description,
            "theme": theme,
            "content_type": content_type,
            "session_id": session_id,
            "speakers": [
                {"title": "Avantika" if content_type == "startup_analysis" else "Priya", "description": "Investment Analyst"},
                {"title": "Hrishikesh" if content_type == "startup_analysis" else "Arjun", "description": "Research Specialist"}
            ],
            "english": english_info,
            "hindi": hindi_info,  # Using 'hindi' field for Hindi (maintaining schema compatibility)
            "report_md": report_info,
            "report_pdf": summary_info,  # Using 'report_pdf' for summary (maintaining schema compatibility)
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        
        db.collection("records").document(record_id).set(record_data)
        print(f"✅ Firebase upload complete. Record ID: {record_id}")
        
        return True, record_id
        
    except Exception as e:
        print(f"❌ Firebase upload failed: {e}")
        return False, None


# --- Helper Functions ---
async def validate_startup_name(startup_name: str) -> Tuple[bool, str]:
    """Validate if this is a legitimate Indian startup using Gemini."""
    try:
        client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

        prompt = f"""Determine if "{startup_name}" is a legitimate Indian startup or company.

Consider:
- Is it a known Indian startup/company?
- Does it operate in India or was founded by Indians?
- Is it in tech, fintech, e-commerce, SaaS, or other startup sectors?
- Examples of valid: Zoho, CRED, Razorpay, Swiggy, Zomato, Ola, Paytm, Freshworks, etc.

Respond with ONLY JSON:
{{"is_valid_startup": true/false, "reason": "brief explanation", "sector": "industry sector if valid"}}"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        # Clean JSON response
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        result = json.loads(response_text)
        is_valid = result.get("is_valid_startup", False)
        reason = result.get("reason", "Unable to classify")

        return is_valid, reason

    except Exception as e:
        print(f"Startup validation error: {e}")
        return True, "Startup accepted (validation unavailable)"


def validate_sector(sector: str) -> Tuple[bool, str]:
    """Validate if sector is in allowed list."""
    if sector in VALID_SECTORS:
        return True, f"Valid sector: {sector}"
    
    # Try fuzzy matching
    sector_lower = sector.lower()
    for valid_sector in VALID_SECTORS:
        if sector_lower in valid_sector.lower() or valid_sector.lower() in sector_lower:
            return True, f"Matched to sector: {valid_sector}"
    
    return False, f"Invalid sector. Must be one of: {', '.join(VALID_SECTORS)}"


async def generate_podcast_with_adk(
    session_id: str,
    startup_name: str,
    session_folder: Path
) -> dict:
    """Generate startup analysis podcast using ADK agent pipeline."""

    start_time = datetime.now(timezone.utc)

    session_service = InMemorySessionService()
    runner = Runner(
        agent=root_agent,
        app_name="startup_analysis_podcast",
        session_service=session_service
    )

    await session_service.create_session(
        app_name="startup_analysis_podcast",
        user_id="lvx_investor",
        session_id=session_id
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=f"Create investment analysis podcast for Indian startup: {startup_name}\nSession ID: {session_id}")]
    )

    print(f"🚀 Starting startup analysis for: {startup_name}")
    print(f"📁 Session folder: {session_folder}")

    try:
        events = [
            event for event in runner.run(
                user_id="lvx_investor",
                session_id=session_id,
                new_message=content,
            )
        ]

        print(f"✅ Received {len(events)} events from agent")

        # Find final response
        final_event = None
        for event in reversed(events):
            try:
                if getattr(event, 'is_final_response', None) and callable(event.is_final_response) and event.is_final_response():
                    final_event = event
                    break
            except Exception:
                pass

        if not final_event:
            for event in reversed(events):
                if getattr(event, 'content', None) and getattr(event.content, 'parts', None):
                    final_event = event
                    break

        if final_event and getattr(final_event, 'content', None):
            print("✅ Final response received")

            duration = (datetime.now(timezone.utc) - start_time).total_seconds()
            print(f"⏱️  Analysis completed in {duration:.1f}s")

            # Move generated files
            files_created = organize_output_files(session_id, session_folder, "startup")

            return {
                "status": "success",
                "files": files_created,
                "duration": duration
            }
        else:
            raise Exception("No valid final response from agent")

    except Exception as e:
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        print(f"❌ Analysis failed after {duration:.1f}s: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        session_service = None


async def generate_newsletter_with_adk(
    session_id: str,
    sector: str,
    session_folder: Path
) -> dict:
    """Generate sector newsletter using ADK agent pipeline."""

    start_time = datetime.now(timezone.utc)

    session_service = InMemorySessionService()
    runner = Runner(
        agent=newsletter_agent,
        app_name="sector_newsletter",
        session_service=session_service
    )

    await session_service.create_session(
        app_name="sector_newsletter",
        user_id="lvx_investor",
        session_id=session_id
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=f"Create sector newsletter and podcast for: {sector}\nSession ID: {session_id}")]
    )

    print(f"📰 Starting newsletter generation for sector: {sector}")
    print(f"📁 Session folder: {session_folder}")

    try:
        events = [
            event for event in runner.run(
                user_id="lvx_investor",
                session_id=session_id,
                new_message=content,
            )
        ]

        print(f"✅ Received {len(events)} events from newsletter agent")

        # Find final response
        final_event = None
        for event in reversed(events):
            try:
                if getattr(event, 'is_final_response', None) and callable(event.is_final_response) and event.is_final_response():
                    final_event = event
                    break
            except Exception:
                pass

        if not final_event:
            for event in reversed(events):
                if getattr(event, 'content', None) and getattr(event.content, 'parts', None):
                    final_event = event
                    break

        if final_event and getattr(final_event, 'content', None):
            print("✅ Newsletter generation complete")

            duration = (datetime.now(timezone.utc) - start_time).total_seconds()
            print(f"⏱️  Newsletter completed in {duration:.1f}s")

            # Move generated files
            files_created = organize_output_files(session_id, session_folder, "newsletter")

            return {
                "status": "success",
                "files": files_created,
                "duration": duration
            }
        else:
            raise Exception("No valid final response from newsletter agent")

    except Exception as e:
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        print(f"❌ Newsletter generation failed after {duration:.1f}s: {e}")
        raise HTTPException(status_code=500, detail=f"Newsletter generation failed: {str(e)}")
    finally:
        session_service = None


def organize_output_files(session_id: str, session_folder: Path, content_type: str) -> dict:
    """Move generated files from root to session folder with proper naming."""

    files_created = {
        "audio_english": None,
        "audio_hindi": None,
        "analysis_report": None,
        "summary_markdown": None,
        "script": None
    }

    if content_type == "startup":
        # Define expected file patterns for startup analysis
        patterns = {
            "audio_english": f"{session_id}_podcast_english.wav",
            "audio_hindi": f"{session_id}_podcast_hindi.wav",
            "analysis_report": f"{session_id}_analysis.md",
            "summary_markdown": f"{session_id}_summary.md",
            "script": f"{session_id}_script.txt"
        }

        # Check root directory for generated files
        root_files = {
            "audio_english": [
                f"{session_id}_podcast_english.wav",
                "startup_analysis_english.wav",
                "podcast_english.wav"
            ],
            "audio_hindi": [
                f"{session_id}_podcast_hindi.wav",
                "startup_analysis_hindi.wav",
                "podcast_hindi.wav"
            ],
            "analysis_report": [
                "startup_analysis_report.md",
                "analysis_report.md",
                "report.md"
            ],
            "summary_markdown": [
                "podcast_summary.md",
                "summary.md",
                f"{session_id}_summary.md"
            ],
            "script": [
                f"{session_id}_script.txt",
                "script.txt",
                "podcast_script.txt"
            ]
        }
    else:  # newsletter
        patterns = {
            "audio_english": f"{session_id}_newsletter_english.wav",
            "audio_hindi": f"{session_id}_newsletter_hindi.wav",
            "analysis_report": "sector_newsletter.md",
            "summary_markdown": None,
            "script": f"{session_id}_script.txt"
        }

        root_files = {
            "audio_english": [
                f"{session_id}_newsletter_english.wav",
                "newsletter_english.wav"
            ],
            "audio_hindi": [
                f"{session_id}_newsletter_hindi.wav",
                "newsletter_hindi.wav"
            ],
            "analysis_report": [
                "sector_newsletter.md",
                "newsletter.md"
            ],
            "summary_markdown": [],
            "script": [
                "podcast_script.txt",
                "script.txt"
            ]
        }

    # Move files to session folder
    for file_type, possible_names in root_files.items():
        if patterns.get(file_type) is None:
            continue
        for filename in possible_names:
            source = Path(filename)
            if source.exists():
                dest = session_folder / patterns[file_type]
                shutil.move(str(source), str(dest))
                files_created[file_type] = str(dest)
                print(f"✅ Moved {filename} → {dest}")
                break

    return files_created


async def generate_podcast_from_pdf(
    session_id: str,
    pdf_path: Path,
    session_folder: Path
) -> dict:
    """Generate startup analysis from PDF using ADK agent pipeline."""

    start_time = datetime.now(timezone.utc)

    session_service = InMemorySessionService()
    runner = Runner(
        agent=pdf_analysis_agent,
        app_name="pdf_startup_analysis",
        session_service=session_service
    )

    await session_service.create_session(
        app_name="pdf_startup_analysis",
        user_id="lvx_investor",
        session_id=session_id
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=f"Analyze startup document and create investment podcast: {pdf_path}\nSession ID: {session_id}")]
    )

    print(f"📄 Starting PDF startup analysis")
    print(f"📁 Session folder: {session_folder}")

    try:
        events = [
            event for event in runner.run(
                user_id="lvx_investor",
                session_id=session_id,
                new_message=content,
            )
        ]

        print(f"✅ Received {len(events)} events from PDF agent")

        final_event = None
        for event in reversed(events):
            try:
                if getattr(event, 'is_final_response', None) and callable(event.is_final_response) and event.is_final_response():
                    final_event = event
                    break
            except Exception:
                pass

        if not final_event:
            for event in reversed(events):
                if getattr(event, 'content', None) and getattr(event.content, 'parts', None):
                    final_event = event
                    break

        if final_event and getattr(final_event, 'content', None):
            print("✅ Final response received (PDF agent)")

            duration = (datetime.now(timezone.utc) - start_time).total_seconds()
            print(f"⏱️  PDF analysis completed in {duration:.1f}s")

            files_created = organize_output_files(session_id, session_folder, "startup")

            return {
                "status": "success",
                "files": files_created,
                "duration": duration
            }
        else:
            raise Exception("No valid final response from PDF agent")

    except Exception as e:
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        print(f"❌ PDF analysis failed after {duration:.1f}s: {e}")
        raise HTTPException(status_code=500, detail=f"PDF analysis failed: {str(e)}")
    finally:
        session_service = None


# --- API Routes ---
@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        message="LVX Startup Analysis & Newsletter Generator",
        version="2.0.0",
        platform="Let's Venture",
        firebase_enabled=FIREBASE_ENABLED,
        timestamp=datetime.now(timezone.utc).isoformat()
    )


@app.post("/analyze-startup", response_model=PodcastResponse)
async def analyze_startup(request: StartupAnalysisRequest):
    """
    Generate investment-grade startup analysis podcast.
    
    Automatically uploads to Firebase if enabled.
    """
    
    session_id = f"lvx_{uuid.uuid4().hex[:8]}"
    session_folder = PODCASTS_FOLDER / session_id
    session_folder.mkdir(exist_ok=True)
    
    print(f"\n{'='*70}")
    print(f"🚀 NEW STARTUP ANALYSIS REQUEST")
    print(f"Session ID: {session_id}")
    print(f"Startup: {request.startup_name}")
    print(f"{'='*70}\n")
    
    try:
        # Validate startup
        print("[1/6] Validating startup name...")
        is_valid, reason = await validate_startup_name(request.startup_name)
        
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid startup name: {reason}"
            )
        
        print(f"✅ Startup validated: {request.startup_name}\n")
        
        # Generate analysis podcast
        print("[2/6] Generating analysis...")
        result = await generate_podcast_with_adk(session_id, request.startup_name, session_folder)
        
        print("[3/6] Analysis complete")
        print("[4/6] Audio files generated")
        
        # Upload to Firebase
        firebase_uploaded = False
        firebase_record_id = None
        
        if FIREBASE_ENABLED:
            print("[5/6] Uploading to Firebase...")
            firebase_uploaded, firebase_record_id = await upload_to_firebase(
                session_id=session_id,
                session_folder=session_folder,
                title=f"Startup Analysis: {request.startup_name}",
                description=f"Investment analysis podcast for {request.startup_name}",
                theme="Startup Analysis",
                content_type="startup_analysis"
            )
            if firebase_uploaded:
                print(f"✅ Firebase upload complete. Record ID: {firebase_record_id}")
        else:
            print("[5/6] Firebase disabled - skipping upload")
        
        print("[6/6] Complete!\n")
        
        response = PodcastResponse(
            status="completed",
            message=f"Successfully generated investment analysis for: {request.startup_name}",
            session_id=session_id,
            startup_name=request.startup_name,
            files={
                "audio_english": result["files"].get("audio_english"),
                "audio_hindi": result["files"].get("audio_hindi"),
                "analysis_report": result["files"].get("analysis_report"),
                "summary_markdown": result["files"].get("summary_markdown"),
                "script": result["files"].get("script"),
                "folder": str(session_folder)
            },
            generated_at=datetime.now(timezone.utc).isoformat(),
            firebase_uploaded=firebase_uploaded,
            firebase_record_id=firebase_record_id
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-newsletter", response_model=NewsletterResponse)
async def generate_newsletter(request: SectorNewsletterRequest):
    """
    Generate sector newsletter and 2-3 minute podcast.
    
    Automatically uploads to Firebase if enabled.
    """
    
    session_id = f"lvx_news_{uuid.uuid4().hex[:8]}"
    session_folder = NEWSLETTERS_FOLDER / session_id
    session_folder.mkdir(exist_ok=True)
    
    print(f"\n{'='*70}")
    print(f"📰 NEW NEWSLETTER REQUEST")
    print(f"Session ID: {session_id}")
    print(f"Sector: {request.sector}")
    print(f"{'='*70}\n")
    
    try:
        # Validate sector
        print("[1/6] Validating sector...")
        is_valid, message = validate_sector(request.sector)
        
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        print(f"✅ {message}\n")
        
        # Generate newsletter
        print("[2/6] Researching sector updates...")
        result = await generate_newsletter_with_adk(session_id, request.sector, session_folder)
        
        print("[3/6] Newsletter written")
        print("[4/6] Podcast audio generated")
        
        # Upload to Firebase
        firebase_uploaded = False
        firebase_record_id = None
        
        if FIREBASE_ENABLED:
            print("[5/6] Uploading to Firebase...")
            firebase_uploaded, firebase_record_id = await upload_to_firebase(
                session_id=session_id,
                session_folder=session_folder,
                title=f"Sector Newsletter: {request.sector}",
                description=f"Weekly investment insights for {request.sector} sector",
                theme=request.sector,
                content_type="sector_newsletter"
            )
            if firebase_uploaded:
                print(f"✅ Firebase upload complete. Record ID: {firebase_record_id}")
        else:
            print("[5/6] Firebase disabled - skipping upload")
        
        print("[6/6] Complete!\n")
        
        response = NewsletterResponse(
            status="completed",
            message=f"Successfully generated newsletter for: {request.sector}",
            session_id=session_id,
            sector=request.sector,
            files={
                "audio_english": result["files"].get("audio_english"),
                "audio_hindi": result["files"].get("audio_hindi"),
                "newsletter": result["files"].get("analysis_report"),
                "script": result["files"].get("script"),
                "folder": str(session_folder)
            },
            generated_at=datetime.now(timezone.utc).isoformat(),
            firebase_uploaded=firebase_uploaded,
            firebase_record_id=firebase_record_id
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-from-pdf", response_model=PDFAnalysisResponse)
async def analyze_from_pdf(file: UploadFile = File(...)):
    """
    Generate startup analysis from PDF document.
    
    Automatically uploads to Firebase if enabled.
    """
    
    session_id = f"lvx_pdf_{uuid.uuid4().hex[:8]}"
    session_folder = PODCASTS_FOLDER / session_id
    session_folder.mkdir(exist_ok=True)
    
    print(f"\n{'='*70}")
    print(f"📄 NEW PDF ANALYSIS REQUEST")
    print(f"Session ID: {session_id}")
    print(f"PDF: {file.filename}")
    print(f"{'='*70}\n")
    
    try:
        # Save PDF
        print("[1/6] Saving uploaded PDF...")
        pdf_path = session_folder / file.filename
        with open(pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)
        print(f"✅ PDF saved\n")
        
        # Generate analysis
        print("[2/6] Analyzing PDF...")
        result = await generate_podcast_from_pdf(session_id, pdf_path, session_folder)
        
        print("[3/6] Analysis complete")
        print("[4/6] Audio files generated")
        
        # Upload to Firebase
        firebase_uploaded = False
        firebase_record_id = None
        
        if FIREBASE_ENABLED:
            print("[5/6] Uploading to Firebase...")
            firebase_uploaded, firebase_record_id = await upload_to_firebase(
                session_id=session_id,
                session_folder=session_folder,
                title=f"PDF Analysis: {file.filename}",
                description=f"Startup analysis from document: {file.filename}",
                theme="PDF Analysis",
                content_type="startup_analysis"
            )
            if firebase_uploaded:
                print(f"✅ Firebase upload complete. Record ID: {firebase_record_id}")
        else:
            print("[5/6] Firebase disabled - skipping upload")
        
        print("[6/6] Complete!\n")
        
        response = PDFAnalysisResponse(
            status="completed",
            message=f"Successfully analyzed PDF: {file.filename}",
            session_id=session_id,
            pdf_filename=file.filename,
            files={
                "pdf": str(pdf_path),
                "audio_english": result["files"].get("audio_english"),
                "audio_hindi": result["files"].get("audio_hindi"),
                "analysis_report": result["files"].get("analysis_report"),
                "summary_markdown": result["files"].get("summary_markdown"),
                "script": result["files"].get("script"),
                "folder": str(session_folder)
            },
            generated_at=datetime.now(timezone.utc).isoformat(),
            firebase_uploaded=firebase_uploaded,
            firebase_record_id=firebase_record_id
        )
        
        return response
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/podcasts/{session_id}/{filename}")
async def download_file(session_id: str, filename: str):
    """Download generated analysis files."""
    file_path = PODCASTS_FOLDER / session_id / filename
    
    if not file_path.exists():
        file_path = NEWSLETTERS_FOLDER / session_id / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {filename} in session {session_id}"
        )
    
    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )


@app.get("/analysis-list")
async def list_analyses():
    """List all startup analysis sessions."""
    sessions = {}
    
    # List startup podcasts
    if PODCASTS_FOLDER.exists():
        for session_dir in PODCASTS_FOLDER.iterdir():
            if session_dir.is_dir():
                files = {
                    "audio_files": sorted([f.name for f in session_dir.glob("*.wav")]),
                    "reports": sorted([f.name for f in session_dir.glob("*.md")]),
                    "pdfs": sorted([f.name for f in session_dir.glob("*.pdf")]),
                    "scripts": sorted([f.name for f in session_dir.glob("*.txt")])
                }
                
                creation_time = datetime.fromtimestamp(
                    session_dir.stat().st_ctime,
                    tz=timezone.utc
                ).isoformat()
                
                sessions[session_dir.name] = {
                    "type": "startup_analysis",
                    "files": files,
                    "created_at": creation_time,
                    "total_files": sum(len(v) for v in files.values())
                }
    
    # List newsletters
    if NEWSLETTERS_FOLDER.exists():
        for session_dir in NEWSLETTERS_FOLDER.iterdir():
            if session_dir.is_dir():
                files = {
                    "audio_files": sorted([f.name for f in session_dir.glob("*.wav")]),
                    "reports": sorted([f.name for f in session_dir.glob("*.md")]),
                    "scripts": sorted([f.name for f in session_dir.glob("*.txt")])
                }
                
                creation_time = datetime.fromtimestamp(
                    session_dir.stat().st_ctime,
                    tz=timezone.utc
                ).isoformat()
                
                sessions[session_dir.name] = {
                    "type": "sector_newsletter",
                    "files": files,
                    "created_at": creation_time,
                    "total_files": sum(len(v) for v in files.values())
                }
    
    return {
        "status": "success",
        "platform": "Let's Venture",
        "podcasts_folder": str(PODCASTS_FOLDER.absolute()),
        "newsletters_folder": str(NEWSLETTERS_FOLDER.absolute()),
        "total_sessions": len(sessions),
        "sessions": sessions
    }


@app.delete("/analysis/{session_id}")
async def delete_analysis(session_id: str):
    """Delete an analysis session."""
    session_folder = PODCASTS_FOLDER / session_id
    
    if not session_folder.exists():
        session_folder = NEWSLETTERS_FOLDER / session_id
    
    if not session_folder.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Session not found: {session_id}"
        )
    
    try:
        shutil.rmtree(session_folder)
        return {
            "status": "success",
            "message": f"Deleted session: {session_id}",
            "deleted_at": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete session: {str(e)}"
        )


@app.get("/sectors")
async def list_sectors():
    """List all available sectors for newsletter generation."""
    return {
        "status": "success",
        "total_sectors": len(VALID_SECTORS),
        "sectors": VALID_SECTORS,
        "description": "Valid sectors for newsletter generation"
    }


@app.get("/firebase-records")
async def list_firebase_records():
    """List all records in Firebase."""
    if not FIREBASE_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="Firebase is not enabled"
        )
    
    try:
        docs = db.collection("records").stream()
        records = []
        
        for doc in docs:
            record_data = doc.to_dict()
            records.append({
                "id": record_data.get("id"),
                "title": record_data.get("title"),
                "theme": record_data.get("theme"),
                "content_type": record_data.get("content_type"),
                "session_id": record_data.get("session_id"),
                "created_at": record_data.get("created_at"),
                "has_english_audio": record_data.get("english") is not None,
                "has_hindi_audio": record_data.get("hindi") is not None,
                "has_report": record_data.get("report_md") is not None
            })
        
        return {
            "status": "success",
            "total_records": len(records),
            "records": records
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch Firebase records: {str(e)}"
        )


@app.get("/health")
async def detailed_health():
    """Detailed health check with API information."""
    return {
        "status": "healthy",
        "service": "LVX Startup Analysis & Newsletter Generator",
        "version": "2.0.0",
        "platform": "Let's Venture",
        "description": "Generate investment-grade content for Indian startups and sectors",
        "firebase_enabled": FIREBASE_ENABLED,
        "endpoints": {
            "health_check": "GET /",
            "analyze_startup": "POST /analyze-startup",
            "generate_newsletter": "POST /generate-newsletter",
            "analyze_from_pdf": "POST /analyze-from-pdf",
            "download_file": "GET /podcasts/{session_id}/{filename}",
            "list_analyses": "GET /analysis-list",
            "list_sectors": "GET /sectors",
            "list_firebase_records": "GET /firebase-records",
            "delete_analysis": "DELETE /analysis/{session_id}",
            "detailed_health": "GET /health"
        },
        "features": {
            "startup_analysis": [
                "Indian startup analysis",
                "Recent news and funding updates",
                "Product launch tracking",
                "Hiring activity monitoring",
                "Competitive landscape analysis",
                "Investment-grade reports",
                "Multi-language audio (English + Hindi)",
                "PDF document analysis"
            ],
            "sector_newsletters": [
                "13 sector coverage",
                "Weekly newsletter generation",
                "2-3 minute podcast briefings",
                "Top stories and funding highlights",
                "Startup spotlight",
                "Sector outlook and trends",
                "Bilingual audio (English + Hindi)"
            ]
        },
        "supported_sectors": VALID_SECTORS,
        "focus": "Investment decision support for Let's Venture investors",
        "target_audience": "Venture capital investors and startup ecosystem stakeholders",
        "podcasts_folder": str(PODCASTS_FOLDER.absolute()),
        "newsletters_folder": str(NEWSLETTERS_FOLDER.absolute()),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*70)
    print("🚀 LVX STARTUP ANALYSIS & NEWSLETTER GENERATOR v2.0")
    print("="*70)
    print(f"📁 Startup Podcasts: {PODCASTS_FOLDER.absolute()}")
    print(f"📰 Newsletters: {NEWSLETTERS_FOLDER.absolute()}")
    print(f"🔥 Firebase: {'Enabled ✅' if FIREBASE_ENABLED else 'Disabled ❌'}")
    print("🎯 Platform: Let's Venture")
    print("="*70)
    print("\n📋 Available Endpoints:")
    print("  • POST /analyze-startup - Generate startup analysis")
    print("  • POST /generate-newsletter - Generate sector newsletter")
    print("  • POST /analyze-from-pdf - Analyze PDF documents")
    print("  • GET  /sectors - List available sectors")
    print("  • GET  /analysis-list - List all sessions")
    print("  • GET  /firebase-records - List Firebase records")
    print("\n🌐 Supported Sectors:")
    for sector in VALID_SECTORS:
        print(f"  • {sector}")
    print("="*70 + "\n")
    if LOCAL_RUN:
        host =  "127.0.0.1"
    else:
        host = "0.0.0.0"
    port = os.getenv("PORT", "8080")
    uvicorn.run(app, host=host, port=port)