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

# ---- Is a sub-agent of `founder_background_score`
founder_background_agent = Agent(
    name="founder_background_agent",
    model="gemini-2.5-pro",
    description=("Agent to gather founder background details."),
    instruction=(FOUNDER_BACKGROUND_RESEARCH_PROMPT),
    tools=[google_search],
)

# ---- Is a sub-agent of `founder_background_score`
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

# ---- Is a sub-agent of `points_calculator_agent`
points_attributer_agent = LlmAgent(
    name="points_attributer_agent",
    model="gemini-2.0-flash",
    description=(
        """
        This is an agent that attributes points based on the the rubric provided in the instruction. It also provides combined concise rationale for the points attributed.
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

# ---- Is a sub-agent of `points_calculator_agent`
code_agent = LlmAgent(
    name=AGENT_NAME,
    model=GEMINI_MODEL,
    code_executor=BuiltInCodeExecutor(),
    instruction=(FOUNDER_BACKGROUND_SCORE_CALCULATOR_PROMPT_V1),
    description="Executes Python code to perform calculations.",
    output_key="founder_background_score",
)

# ---- Is a sub-agent of `points_and_rationale_agent`
points_calculator_agent = SequentialAgent(
    name="points_calculator_agent",
    description=(
        """
        This is an agent that calculates points for each founder based on the rubric provided.
        It first calls the 'points_attributer_agent' to attribute points to each founder.
        Then, it calls the 'code_agent' to calculate the overall founder background score.
        """
    ),
    sub_agents=[points_attributer_agent, code_agent],
)

# ---- Is a sub-agent of `points_and_rationale_agent`
founder_data_summarizer = LlmAgent(
    name="founder_data_summarizer",
    model="gemini-2.0-flash",
    description=(
        """
        This agent generates a combined summary using multiple founders' background data.
        """
    ),
    instruction=(
        """
        Use the founder data gathered from 'founder_background_agent' to provide a concise summary of all the founders' background information.
        """
    ),
    output_key="founder_data_summary",
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

# ---- Is a sub-agent of `founder_background_score`
points_and_rationale_agent = ParallelAgent(
    name="points_and_rationale_agent",
    description=(
        """
        This is an agent that runs two sub-agents in parallel:
        - 'founder_data_summarizer' summarizes the founder background data.
        - 'points_calculator_agent' to calculate the overall founder background score.
        It returns both the score and the founder data summary as rationale.
        """
    ),
    sub_agents=[points_calculator_agent, founder_data_summarizer],
)

# ---- sub-agents of `data_fetcher_agent`
founder_background_score = SequentialAgent(
    name="founder_background_score",
    description=(
        """
        This is an agent that fetches and calculates the founder background score along with rationale.
        It first calls the 'founder_background_agent' to gather founder background details.
        Then, it calls the 'format_agent' to format the gathered details.
        Finally, it calls the 'points_and_rationale_agent' to calculate the founder background score along with rationale.
        """
    ),
    sub_agents=[
        founder_background_agent,
        format_agent,
        points_and_rationale_agent,
    ],
)


# ---- Is a sub-agent of `data_fetcher_agent`
startup_evaluation_agent = Agent(
    name="startup_evaluation_agent",
    model="gemini-2.5-pro",
    description=(
        "Agent to calculate startup evaluation scores and gives rationale for each score."
    ),
    instruction=(
        REVENUE_GROWTH_SCORE_PROMPT
        + "\n"
        + FINANCIAL_STRENGTH_SCORE_PROMPT
        + "\n"
        + INDUSTRY_HEALTH_SCORE_PROMPT
    ),
    tools=[google_search],
)


# ---- Is a sub-agent of `final_evaluation_score_agent`
data_fetcher_agent = ParallelAgent(
    name="data_fetcher_agent",
    description=(
        """
        This is an agent that fetches data using two sub-agents:
        1. 'founder_background_score' to get the founder background score along with rationale.
        2. 'startup_evaluation_agent' to get the startup evaluation scores along with rationale for each score.
        It returns both the founder background score and the evaluation scores along with rationale for each score in a structured format.
        """
    ),
    sub_agents=[founder_background_score, startup_evaluation_agent],
)

# ---- Is a sub-agent of `final_evaluation_score_agent`
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

# ---- Root agent
final_evaluation_score_agent = SequentialAgent(
    name="final_evaluation_score_agent",
    description="""This is the root agent that coordinates the data fetching and combining agents.
    It first calls the 'data_fetcher_agent' to get the founder background score and startup evaluation scores.
    Then, it calls the 'data_combiner_agent' to combine these scores into a final structured output.
    """,
    sub_agents=[data_fetcher_agent, data_combiner_agent],
)

root_agent = final_evaluation_score_agent
