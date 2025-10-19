import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent, LlmAgent, SequentialAgent
from google.adk.tools import google_search

from evaluation_score.agent import EvaluationScoreComplete
from .prompts import COMPETITOR_ANALYSIS_PROMPT
from pydantic import BaseModel

# class FundingRound(BaseModel):
#     amount: str
#     round_type: str

class CompetitorInfo(BaseModel):
    competitor_name: str
    # funding_rounds: list[FundingRound]
    last_funding: str  # derived attribute
    stage: str
    total_funding: str  # derived attribute
    location: str

class CompetitorInfoWithScore(BaseModel):
    competitor_name: str
    # funding_rounds: list[FundingRound]
    last_funding: str  # derived attribute
    stage: str
    total_funding: str  # derived attribute
    location: str
    evaluation_score: EvaluationScoreComplete
    
class AllCompetitorsInfo(BaseModel):
    competitors: list[CompetitorInfo]

class AllCompetitorsInfoWithScore(BaseModel):
    competitors: list[CompetitorInfoWithScore]

data_fetcher_agent = Agent(
    name="competitor_analysis_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to gather competitor details of a company."
    ), 
    instruction=(
COMPETITOR_ANALYSIS_PROMPT
    ),
    tools=[google_search],
)


data_formatter_agent = LlmAgent(
    name="data_formatter_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that formats the competitor data into a structured JSON format.
        """
    ),
    instruction=(
      """
      You are an expert data analyst. Your task is to format the competitor data fetched by the previous agent into a structured JSON format."""
    ),
    output_schema=AllCompetitorsInfo,
    disallow_transfer_to_parent=True, # <---- here 
    disallow_transfer_to_peers=True, # <---- here 
)

competitor_analysis_agent = SequentialAgent(
    name="competitor_analysis_agent",
    sub_agents=[data_fetcher_agent, data_formatter_agent],
    
) 