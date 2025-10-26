from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent
from google.adk.tools import google_search
from .prompts import FIND_COMPETITORS_PROMPT
from .models import AllCompetitorsInfoWithScore
from evaluation_score.agent import final_evaluation_score_agent
from google.adk.tools.agent_tool import AgentTool

competitor_finder_agent = LlmAgent(
    name="competitor_finder_agent",
    model="gemini-2.0-flash",
    description=("Agent to gather competitor details of a company."),
    instruction=(FIND_COMPETITORS_PROMPT),
    tools=[google_search],
)


company_details_agent = LlmAgent(
    name="company_details_agent",
    model="gemini-2.0-flash",
    description=("Agent to gather detailed information about given company."),
    instruction="""
You are an expert senior researcher at a startup evaulation firm who uses scrapers to get data about startups.

Your task is to gather competitor details given a company name.

## Use planning agent design pattern. Following are the steps of the plan

1. Gather information about the specified company
2. Use that information to search for 5 competitor companies matching the description of the specified company
3. For each competitor and including the specified company, get the following data:
    - company name
    - last funding (date in 16-Oct-2025 format)
    - stage
    - total funding (in $<value>M)
    - location
""",
    tools=[google_search],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
    output_key="company_details",
)

evaluation_score_tool = AgentTool(
    agent=final_evaluation_score_agent,
)

evaluation_score_agent = LlmAgent(
    name="evaluation_score_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent that calculates score for each of the competitors as well as original company."
    ),
    instruction="""
    Your task is to simply call the tool with the company name to get the evaluation score for that company.""",
    tools=[evaluation_score_tool],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
    output_key="evaluation_score",
)


company_analysis_agent = ParallelAgent(
    name="company_analysis_agent",
    description=(
        """
        This is an agent that analyzes a company.
        It uses two sub-agents:
        1. 'company_details_agent' to fetch detailed information about the company.
        2. 'evaluation_score_agent' to evaluate and score the company based on predefined criteria.
        The agent returns a structured output containing details and scores for the company.
        """
    ),
    sub_agents=[
        company_details_agent,
        # final_evaluation_score_agent],
        evaluation_score_agent,
    ],
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
    output_schema=AllCompetitorsInfoWithScore,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

root_agent = SequentialAgent(
    name="competitor_analysis_agent_parallel",
    description="""This is the root agent that coordinates the competitor analysis process.
    It first calls the 'competitor_finder_agent' to get a list of competitor companies.
    Then, it calls the 'company_analysis_agent' to analyze each competitor and the original company.
    Finally, it calls the 'data_formatter_agent' to format the collected data into a structured JSON output.
    """,
    sub_agents=[
        competitor_finder_agent,
        company_analysis_agent,
        data_formatter_agent,
    ],
)
