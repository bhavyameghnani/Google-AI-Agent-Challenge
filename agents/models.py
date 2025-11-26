from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
from research_agent.models import CompanyProfile
from competitor_analysis_agent.models import (
    AllCompetitorsInfoWithScore,
)


class CompanyRequest(BaseModel):
    company_name: str


class CompanyResponse(BaseModel):
    company_name: str
    data: Union[CompanyProfile, Dict[str, Any]]  # Accept both CompanyProfile and raw dict (for pitch deck data)
    source: str  # "database" or "extraction" or "forced_extraction"
    last_updated: str
    cache_age_days: int
    extraction_status: str


class CompetitorResponse(BaseModel):
    company_name: str
    data: AllCompetitorsInfoWithScore
    source: str  # "database" or "extraction" or "forced_extraction"
    last_updated: str
    cache_age_days: int
    extraction_status: str


class CompanyListItem(BaseModel):
    company_name: str
    industry_sector: Optional[str] = None
    year_founded: Optional[int] = None
    headquarters_location: Optional[str] = None
    latest_valuation: Optional[str] = None
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
