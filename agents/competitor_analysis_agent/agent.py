from google.adk.agents import Agent, LlmAgent, SequentialAgent
from google.adk.tools import google_search

from .prompts import COMPETITOR_ANALYSIS_PROMPT
from .models import AllCompetitorsInfo


data_fetcher_agent = Agent(
    name="competitor_analysis_agent",
    model="gemini-2.5-pro",
    description=("Agent to gather competitor details of a company."),
    instruction=(COMPETITOR_ANALYSIS_PROMPT),
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
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

competitor_analysis_agent = SequentialAgent(
    name="competitor_analysis_agent",
    sub_agents=[data_fetcher_agent, data_formatter_agent],
)
