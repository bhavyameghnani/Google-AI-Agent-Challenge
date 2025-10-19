import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent, LlmAgent, SequentialAgent, ParallelAgent
from google.adk.tools import google_search
from .prompts import PROMPT_V1, POINTS_ATTRIBUTER_PROMPT_V1, FOUNDER_BACKGROUND_SCORE_CALCULATOR_PROMPT_V1
from .prompts import PROMPT_V1, POINTS_ATTRIBUTER_PROMPT_V1, REVENUE_GROWTH_SCORE_PROMPT, FINANCIAL_STRENGTH_SCORE_PROMPT, INDUSTRY_HEALTH_SCORE_PROMPT
from pydantic import BaseModel, Field, conlist
from typing import List, Optional
from enum import Enum
from google.adk.code_executors import BuiltInCodeExecutor

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

founder_background_agent = Agent(
    name="founder_background_agent",
    # model="gemini-2.0-flash",
    model="gemini-2.5-pro",
    description=(
        "Agent to gather founder background details."
    ),
    instruction=(
PROMPT_V1
    ),
    tools=[google_search],
    # output_schema=MultipleFoundersData,
)

format_agent = LlmAgent(
    name="format_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that formats the answers from the agent 'founder_background_agent'.
        """
    ),
    instruction=(
        """
        You are an agent that formats the answers from the agent 'founder_background_agent' into a structured format.
        """
    ),
    output_schema=MultipleFoundersData,
    disallow_transfer_to_parent=True, # <---- here 
    disallow_transfer_to_peers=True, # <---- here 
)

points_attributer_agent = LlmAgent(
    name="points_attributer_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that attributes points based on the the rubric provided in the instruction.
        """
    ),
    instruction=(
        POINTS_ATTRIBUTER_PROMPT_V1
    ),
    output_schema=MultipleFoundersScore,
    disallow_transfer_to_parent=True, # <---- here 
    disallow_transfer_to_peers=True, # <---- here 
)

AGENT_NAME = "calculator_agent"
APP_NAME = "calculator"
USER_ID = "user1234"
SESSION_ID = "session_code_exec_async"
GEMINI_MODEL = "gemini-2.0-flash"

# Agent Definition
code_agent = LlmAgent(
    name=AGENT_NAME,
    model=GEMINI_MODEL,
    code_executor=BuiltInCodeExecutor(),
    instruction=(FOUNDER_BACKGROUND_SCORE_CALCULATOR_PROMPT_V1),
    description="Executes Python code to perform calculations.",
    output_key="founder_background_score",
)

founder_background_score = SequentialAgent(
    name="founder_background_score",
    description=(
        """
        This is the root agent that coordinates the search and formatting agents.
        1. It first calls the 'founder_background_agent' to gather founder background details
        2. It then calls the 'formater_agent' to format the gathered details into a structured format.
        3. It attributes points to each founder based on the rubric provided in the 'points_attributer_agent'.
        4. Finally, it calls the 'calculator_agent' to calculate the overall founder background score.
        5. It returns only the final overall founder background score as plain text. Without markdown or code.
        """
    ),
    sub_agents=[founder_background_agent, format_agent, points_attributer_agent, code_agent],
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

format_agent2 = LlmAgent(
    name="format_agent2",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that formats the answers from the agent 'startup_evaluation_agent'.
        """
    ),
    output_schema=EvaluationScoreComplete,
    output_key="evaluation_scores",
    disallow_transfer_to_parent=True, # <---- here 
    disallow_transfer_to_peers=True, # <---- here 
)

data_fetcher_agent = ParallelAgent(
    name="data_fetcher_agent",
    description=(
        """
        This is an agent that fetches data using two sub-agents:
        1. 'founder_background_score' to get the founder background score.
        2. 'startup_evaluation_agent' to get the startup evaluation scores.
        It returns both the founder background score and the evaluation scores.
        """
    ),
    sub_agents=[founder_background_score, startup_evaluation_agent],
)

data_combiner_agent = LlmAgent(
    name="data_combiner_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that combines the founder background score with the evaluation scores.
        """
    ),
    instruction=(
        """
        You are an agent that combines the founder background score with the evaluation scores.
        1. Take the founder background score from 'founder_background_score'.
        2. Take the evaluation scores from 'startup_evaluation_agent'.
        3. Combine them into a single structured output.
        4. Return the combined output as per the schema 'EvaluationScoreComplete'.
        """
    ),
    output_schema=EvaluationScoreComplete,
    output_key="final_evaluation_scores",
    disallow_transfer_to_parent=True, # <---- here 
    disallow_transfer_to_peers=True, # <---- here 
)

final_evaluation_score_agent = SequentialAgent(
    name="final_evaluation_score_agent",
    description="""This is the root agent that coordinates the data fetching and combining agents.
    It first calls the 'data_fetcher_agent' to get the founder background score and startup evaluation scores.
    Then, it calls the 'data_combiner_agent' to combine these scores into a final structured output.
    """,
    sub_agents=[data_fetcher_agent, data_combiner_agent],
    
)