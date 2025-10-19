from pydantic import BaseModel, Field, conlist
from typing import List, Optional

class EvaluationScore(BaseModel):
    """
    Represents the evaluation score data for a startup.
    """
    revenue_growth_score: int = Field(
        ...,
        description="Score based on revenue growth percentage."
    )
    financial_strength_score: int = Field(
        ...,
        description="Score based on financial strength metrics."
    )
    industry_health_score: int = Field(
        ...,
        description="Score based on industry health and market factors."
    )

class EvaluationScoreComplete(BaseModel):
    """
    Represents the complete evaluation score data for a startup.
    """
    revenue_growth_score: int = Field(
        ...,
        description="Score based on revenue growth percentage."
    )
    financial_strength_score: int = Field(
        ...,
        description="Score based on financial strength metrics."
    )
    industry_health_score: int = Field(
        ...,
        description="Score based on industry health and market factors."
    )
    founder_background_score: int = Field(
        ...,
        description="Score based on founder background evaluation.",
    )

# Top-tier school (IIT, IIM, Ivy) → 1000; Tier-2 → 700; Tier-3 → 500
class EducationPrestige(Enum):
    TIER_1 = "Tier-1"
    TIER_2 = "Tier-2"   
    TIER_3 = "Tier-3"
    
# Successful exit → 1000; Prior startup raised VC → 800; No startup exp. → 500
class PastStartupExperience(Enum):
    SUCCESSFUL_EXIT = "Successful exit"
    PRIOR_VC_FUNDING = "Prior startup raised VC"
    NO_STARTUP_EXPERIENCE = "No startup experience"
    
# 10+ yrs in same domain → 1000; 5–10 yrs → 800; <5 yrs → 600
class DomainExpertise(Enum):
    MORE_THAN_10_YEARS = "10+ years"
    BETWEEN_5_AND_10_YEARS = "5-10 years"
    LESS_THAN_5_YEARS = "<5 years"
    
# CXO in large firm → 1000; Sr. Manager → 800; Junior roles → 600
class LeadershipRoles(Enum):
    CXO_IN_LARGE_FIRM = "CXO in large firm"
    SENIOR_MANAGER = "Senior Manager"
    JUNIOR_ROLES = "Junior roles"
    
# Multiple Tier-1 investors & accelerators in network → 1000; limited → 600
class NetworkStrength(Enum):
    MULTIPLE_TIER_1 = "Multiple Tier-1"
    LIMITED = "Limited"
    
# Positive media, awards → 1000; Neutral → 700; Negative controversies → 300
class ReputationSignals(Enum):
    POSITIVE_MEDIA_AWARDS = "Positive media, awards"
    NEUTRAL = "Neutral"
    NEGATIVE_CONTROVERSIES = "Negative controversies"

class FounderBackgroundData(BaseModel):
    """
    Represents the background and profile data for a single founder.
    The scores are based on the rubric provided in the document[cite: 4].
    """
    founder_name: str = Field(
        None,
        description="Name of the founder.",
    )
    education_prestige: Optional[str]
    past_startup_experience: Optional[str]
    domain_expertise: Optional[str]
    leadership_roles: Optional[str]
    network_strength: Optional[str]
    reputation_signals: Optional[str]
    # education_prestige: Optional[EducationPrestige]
    # past_startup_experience: Optional[PastStartupExperience]
    # domain_expertise: Optional[DomainExpertise]
    # leadership_roles: Optional[LeadershipRoles]
    # network_strength: Optional[NetworkStrength]
    # reputation_signals: Optional[ReputationSignals]

class MultipleFoundersData(BaseModel):
    """
    Represents the background and profile data for multiple founders.
    """
    founders: conlist(FounderBackgroundData, min_length=1) = Field(
        ...,
        description="List of founder background data.",
    )
    
class FounderBackgroundScore(BaseModel):
    """
    Represents the background and profile data for a single founder.
    The scores are based on the rubric provided in the document[cite: 4].
    """
    education_prestige_score: int = Field(
        ...,
        description="Score based on educational background and university prestige (e.g., Top-tier -> 1000)."
    )
    past_startup_experience_score: int = Field(
        ...,
        description="Score based on prior startup experience (e.g., Successful exit -> 1000)."
    )
    domain_expertise_score: int = Field(
        ...,
        description="Score based on years of experience in the relevant domain (e.g., 10+ yrs -> 1000)."
    )
    leadership_roles_score: int = Field(
        ...,
        description="Score based on past leadership roles (e.g., CXO in large firm -> 1000)."
    )
    network_strength_score: int = Field(
        ...,
        description="Score based on connections to investors and accelerators (e.g., Multiple Tier-1 investors -> 1000)."
    )
    reputation_signals_score: int = Field(
        ...,
        description="Score based on media presence, awards, and thought leadership (e.g., Positive media -> 1000)."
    )

class MultipleFoundersScore(BaseModel):
    """
    Represents the background and profile data for multiple founders.
    """
    founders: conlist(FounderBackgroundScore, min_length=1) = Field(
        ...,
        description="List of founder background score.",
    )