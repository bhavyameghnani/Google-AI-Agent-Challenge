from google.adk.agents import Agent, LlmAgent, ParallelAgent, SequentialAgent
from google.adk.code_executors import BuiltInCodeExecutor
from google.adk.tools import google_search

from .models import EvaluationScoreComplete, MultipleFoundersData, MultipleFoundersScore
from .prompts import (
    FINANCIAL_STRENGTH_SCORE_PROMPT,
    FOUNDER_BACKGROUND_RESEARCH_PROMPT,
    FOUNDER_BACKGROUND_SCORE_CALCULATOR_PROMPT_V1,
    INDUSTRY_HEALTH_SCORE_PROMPT,
    POINTS_ATTRIBUTER_PROMPT_V1,
    REVENUE_GROWTH_SCORE_PROMPT,
)

founder_background_agent = Agent(
    name="founder_background_agent",
    model="gemini-2.5-pro",
    description=("Agent to gather founder background details."),
    instruction=(FOUNDER_BACKGROUND_RESEARCH_PROMPT),
    tools=[google_search],
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
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

points_attributer_agent = LlmAgent(
    name="points_attributer_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that attributes points based on the the rubric provided in the instruction.
        """
    ),
    instruction=(POINTS_ATTRIBUTER_PROMPT_V1),
    output_schema=MultipleFoundersScore,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
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
    sub_agents=[
        founder_background_agent,
        format_agent,
        points_attributer_agent,
        code_agent,
    ],
)


startup_evaluation_agent = Agent(
    name="startup_evaluation_agent",
    model="gemini-2.5-pro",
    description=("Agent to calculate startup evaluation scores."),
    instruction=(
        REVENUE_GROWTH_SCORE_PROMPT
        + "\n"
        + FINANCIAL_STRENGTH_SCORE_PROMPT
        + "\n"
        + INDUSTRY_HEALTH_SCORE_PROMPT
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
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
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
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

final_evaluation_score_agent = SequentialAgent(
    name="final_evaluation_score_agent",
    description="""This is the root agent that coordinates the data fetching and combining agents.
    It first calls the 'data_fetcher_agent' to get the founder background score and startup evaluation scores.
    Then, it calls the 'data_combiner_agent' to combine these scores into a final structured output.
    """,
    sub_agents=[data_fetcher_agent, data_combiner_agent],
)
