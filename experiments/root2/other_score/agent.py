import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent, LlmAgent, SequentialAgent
from google.adk.tools import google_search
from .prompts import PROMPT_V1, POINTS_ATTRIBUTER_PROMPT_V1, REVENUE_GROWTH_SCORE_PROMPT, FINANCIAL_STRENGTH_SCORE_PROMPT, INDUSTRY_HEALTH_SCORE_PROMPT
from pydantic import BaseModel, Field, conlist
from typing import List, Optional
from enum import Enum
from google.adk.code_executors import BuiltInCodeExecutor

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

revenue_growth = Agent(
    name="revenue_growth_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to calculate the revenue growth score based on the revenue growth percentage."
    ),
    instruction=(
REVENUE_GROWTH_SCORE_PROMPT
    ),
    tools=[google_search],
)

financial_strength = Agent(
    name="financial_strength_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to calculate the financial strength score based on various financial metrics."
    ),
    instruction=(
FINANCIAL_STRENGTH_SCORE_PROMPT
    ),
    tools=[google_search],
)

industry_health = Agent(
    name="industry_health_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to calculate the industry health score based on various market and competitive factors."
    ),
    instruction=(
INDUSTRY_HEALTH_SCORE_PROMPT
    ),
    tools=[google_search],
)

startup_evaluation_agent = Agent(
    name="startup_evaluation_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to calculate startup evaluation scores."
    ),
    instruction=(
        REVENUE_GROWTH_SCORE_PROMPT + "\n" + FINANCIAL_STRENGTH_SCORE_PROMPT + "\n" +
        INDUSTRY_HEALTH_SCORE_PROMPT
    ),
    tools=[google_search],
)

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

format_agent = LlmAgent(
    name="format_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that formats the answers from the agent 'startup_evaluation_agent'.
        """
    ),
    output_schema=EvaluationScore,
)


root_agent = SequentialAgent(
    name="root_agent",
    description="""Agent to evaluate startup based on multiple criteria.
    1. Gather evaluation scores using 'startup_evaluation_agent'.
    2. Format the scores using 'format_agent'.
    3. Return the final structured evaluation scores.
    """,
    sub_agents=[startup_evaluation_agent, format_agent],
    
)
    

 