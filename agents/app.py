# app.py - FastAPI Firebase Implementation for Company Data Extraction
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import firebase_admin
from firebase_admin import credentials, firestore

# Import your ADK agent
from research_agent.agent import root_agent, CompanyProfile

# Initialize FastAPI app
app = FastAPI(
    title="Company Data Extraction API",
    description="Extract comprehensive company data using Google ADK with Firebase caching",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "ai-agent-company-data-firebase-adminsdk-fbsvc-dee36e1d04.json"
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)

db = firestore.client()
companies_ref = db.collection('companies')
logs_ref = db.collection('extraction_logs')

# --- Pydantic Models ---

class CompanyRequest(BaseModel):
    company_name: str

class CompanyResponse(BaseModel):
    company_name: str
    data: CompanyProfile
    source: str  # "database" or "extraction" or "forced_extraction"
    last_updated: str
    cache_age_days: int
    extraction_status: str

class CompanyListItem(BaseModel):
    company_name: str
    last_updated: Optional[str]
    cache_age_days: Optional[int]
    extraction_status: str
    is_fresh: bool

class CompanyListResponse(BaseModel):
    total_companies: int
    companies: List[CompanyListItem]

class StatsResponse(BaseModel):
    total_companies: int
    fresh_data_count: int
    recent_extractions_7d: int
    extraction_attempts_7d: int
    cache_hit_rate: str

class HealthResponse(BaseModel):
    message: str
    status: str
    timestamp: str

# --- Helper Functions ---

def validate_company_name(company_name: str) -> tuple[bool, str]:
    """Validate company name input"""
    if not company_name or not company_name.strip():
        return False, "Company name is required"
    if len(company_name.strip()) < 2:
        return False, "Company name must be at least 2 characters"
    return True, ""

def get_company_from_firebase(company_name: str) -> Optional[Dict[str, Any]]:
    """Get company data from Firebase"""
    try:
        doc_id = company_name.lower().replace(" ", "_")
        doc = companies_ref.document(doc_id).get()
        
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error reading from Firebase: {e}")
        return None

def save_company_to_firebase(company_name: str, company_data: CompanyProfile) -> bool:
    """Save company data to Firebase"""
    try:
        doc_id = company_name.lower().replace(" ", "_")
        
        document_data = {
            'company_name': company_name,
            'last_updated': datetime.now(timezone.utc),
            'extraction_status': 'completed',
            'created_at': firestore.SERVER_TIMESTAMP,
            'data': company_data.dict()
        }
        
        companies_ref.document(doc_id).set(document_data)
        print(f"✅ Saved {company_name} to Firebase")
        return True
        
    except Exception as e:
        print(f"❌ Error saving to Firebase: {e}")
        return False

def log_extraction_attempt(company_name: str, status: str, duration: Optional[float] = None, error: Optional[str] = None):
    """Log extraction attempt to Firebase"""
    try:
        log_data = {
            'company_name': company_name,
            'timestamp': datetime.now(timezone.utc),
            'status': status,  # 'started', 'completed', 'failed'
            'duration_seconds': duration,
            'error_message': error,
            'created_at': firestore.SERVER_TIMESTAMP
        }
        
        logs_ref.add(log_data)
    except Exception as e:
        print(f"Error logging to Firebase: {e}")

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
        print(f"⚠️ is_data_fresh error: {e}")
        return False

    

async def extract_company_data_with_adk(company_name: str) -> CompanyProfile:
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types

    start_time = datetime.now(timezone.utc)
    log_extraction_attempt(company_name, 'started')

    session_service = InMemorySessionService()
    runner = Runner(
        agent=root_agent,
        app_name="company_extraction",
        session_service=session_service
    )
    session_id = f"extract_{uuid.uuid4().hex[:8]}"

    await session_service.create_session(
        app_name="company_extraction",
        user_id="api_user",
        session_id=session_id
    )

    content = types.Content(role="user", parts=[types.Part(text=company_name)])

    print(f"🤖 Starting ADK extraction for: {company_name}")
    try:
        # Run the agent and collect all events into a list
        events = [
            event for event in runner.run(
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
            print("✅ Final JSON event received from agent.")
            json_string = final_event.content.parts[0].text
            final_structured_output = json.loads(json_string)

            company_profile = CompanyProfile(**final_structured_output)

            duration = (datetime.now(timezone.utc) - start_time).total_seconds()
            log_extraction_attempt(company_name, 'completed', duration)
            print(f"✅ ADK extraction completed for: {company_name} ({duration:.1f}s)")
            return company_profile
        else:
            # If for some reason there's no final event, raise an error
            raise Exception("Agent did not produce a valid final response.")

    except Exception as e:
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        log_extraction_attempt(company_name, 'failed', duration, str(e))
        print(f"❌ ADK extraction failed for: {company_name} - {e}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")
    finally:
        print(f"🧹 Finished processing for session: {session_id}")
        session_service = None
        print(f"✅ Session cleanup completed for: {session_id}")

# --- API Routes ---

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        message="Company Data Extraction API is running!",
        status="healthy",
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@app.post("/extract", response_model=CompanyResponse)
async def extract_company(request: CompanyRequest):
    """
    Main endpoint: Extract company data with Firebase caching
    
    - Checks Firebase cache first
    - Extracts fresh data if cache is stale/missing
    - Returns structured company profile
    """
    company_name = request.company_name.strip()
    
    # Validate input
    is_valid, error_msg = validate_company_name(company_name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Check Firebase cache first
    print(f"🗄️ Checking cache for: {company_name}")
    cached_data = get_company_from_firebase(company_name)

    if cached_data and is_data_fresh(cached_data.get('last_updated')):
        # Return cached data
        cache_age = (datetime.now(timezone.utc) - cached_data['last_updated']).days
        print(f"🗄️ Returning cached data for: {company_name}")
        
        return CompanyResponse(
            company_name=company_name,
            data=CompanyProfile(**cached_data['data']),
            source="database",
            last_updated=cached_data['last_updated'].isoformat(),
            cache_age_days=cache_age,
            extraction_status=cached_data.get('extraction_status', 'completed')
        )
    
    # Extract fresh data using ADK
    print(f"🔍 Extracting fresh data for: {company_name}")
    company_profile = await extract_company_data_with_adk(company_name)
    
    # Save to Firebase
    save_success = save_company_to_firebase(company_name, company_profile)
    
    if not save_success:
        print("⚠️ Warning: Failed to save to Firebase, but extraction succeeded")
    
    return CompanyResponse(
        company_name=company_name,
        data=company_profile,
        source="extraction",
        last_updated=datetime.now(timezone.utc).isoformat(),
        cache_age_days=0,
        extraction_status="completed"
    )

# @app.get("/company/{company_name}", response_model=CompanyResponse)
# async def get_company(company_name: str):
#     """
#     Get company data from Firebase cache only (no extraction)
    
#     Returns cached company data or 404 if not found
#     """
#     # Validate input
#     is_valid, error_msg = validate_company_name(company_name)
#     if not is_valid:
#         raise HTTPException(status_code=400, detail=error_msg)
    
#     cached_data = get_company_from_firebase(company_name)
    
#     if not cached_data:
#         raise HTTPException(status_code=404, detail="Company not found in database")
    
#     cache_age = (datetime.now(timezone.utc) - cached_data['last_updated']).days
    
#     return CompanyResponse(
#         company_name=company_name,
#         data=CompanyProfile(**cached_data['data']),
#         source="database",
#         last_updated=cached_data['last_updated'].isoformat(),
#         cache_age_days=cache_age,
#         extraction_status=cached_data.get('extraction_status', 'completed')
#     )

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
            cache_age = (datetime.now(timezone.utc) - data['last_updated']).days if data.get('last_updated') else None
            
            companies.append(CompanyListItem(
                company_name=data.get('company_name', 'Unknown'),
                last_updated=data['last_updated'].isoformat() if data.get('last_updated') else None,
                cache_age_days=cache_age,
                extraction_status=data.get('extraction_status', 'unknown'),
                is_fresh=is_data_fresh(data.get('last_updated'))
            ))
        
        return CompanyListResponse(
            total_companies=len(companies),
            companies=companies
        )
        
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
            last_updated = data.get('last_updated')
            
            if is_data_fresh(last_updated, 30):
                fresh_count += 1
            if is_data_fresh(last_updated, 7):
                recent_count += 1
        
        # Get recent extraction logs
        recent_logs = logs_ref.where('timestamp', '>=', datetime.now(timezone.utc) - timedelta(days=7)).stream()
        recent_extractions = len(list(recent_logs))
        
        cache_hit_rate = f"{(fresh_count/total_count*100):.1f}%" if total_count > 0 else "0%"
        
        return StatsResponse(
            total_companies=total_count,
            fresh_data_count=fresh_count,
            recent_extractions_7d=recent_count,
            extraction_attempts_7d=recent_extractions,
            cache_hit_rate=cache_hit_rate
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.post("/refresh/{company_name}", response_model=CompanyResponse)
# async def refresh_company(company_name: str):
#     """
#     Force refresh company data (bypass cache)
    
#     Always extracts fresh data regardless of cache status
#     """
#     # Validate input
#     is_valid, error_msg = validate_company_name(company_name)
#     if not is_valid:
#         raise HTTPException(status_code=400, detail=error_msg)
    
#     # Force fresh extraction
#     print(f"🔄 Force refreshing data for: {company_name}")
#     company_profile = await extract_company_data_with_adk(company_name)
    
#     # Save to Firebase
#     save_company_to_firebase(company_name, company_profile)
    
#     return CompanyResponse(
#         company_name=company_name,
#         data=company_profile,
#         source="forced_extraction",
#         last_updated=datetime.now(timezone.utc).isoformat(),
#         cache_age_days=0,
#         extraction_status="completed"
#     )

# --- Run Server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005)