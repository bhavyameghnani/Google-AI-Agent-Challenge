import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent
from google.adk.tools import google_search
from .prompts import PROMPT_V1

root_agent = Agent(
    name="competitor_analysis_agent",
    # model="gemini-2.0-flash",
    model="gemini-2.5-pro",
    description=(
        "Agent to gather competitor details of a company."
    ), 
    instruction=(
PROMPT_V1
    ),
    tools=[google_search],
)