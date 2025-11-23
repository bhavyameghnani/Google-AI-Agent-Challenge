"""
Fact check agent pipeline module.

This module composes a small, multi-step fact-checking pipeline using LLM-based agents
and a search tool. It provides a ready-to-run SequentialAgent named `root_agent`
that orchestrates claim extraction, web evidence retrieval, claim-evidence comparison,
and final formatting into a structured FactCheckReport.

Key components
- GEMINI_LARGE, GEMINI_SMALL: Model identifiers used to configure LlmAgent instances.
    Adjust these constants to point to different models if required.
- claim_extractor (LlmAgent): Extracts one or more discrete factual claims from input text.
- evidence_search_agent (LlmAgent): Uses the `google_search` tool to locate web evidence
    that supports or refutes extracted claims.
- fact_comparison_agent (LlmAgent): Compares claims to retrieved evidence and determines
    verdicts (e.g., supported, refuted, ambiguous), with reasoning and citations.
- data_format_agent (LlmAgent): Formats the aggregated results into the `FactCheckReport`
    output schema exported from `.models`.

Export
- root_agent: The SequentialAgent that ties the above sub-agents together. Run this
    agent with the appropriate input to obtain a structured FactCheckReport-like result.
"""

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search
from .models import FactCheckReport
from .prompts import (
    CLAIM_EXTRACTION_PROMPT,
    EVIDENCE_SEARCH_PROMPT,
    FACT_COMPARISON_PROMPT,
)
from gemini_model_config import GEMINI_LARGE, GEMINI_SMALL


# ------------------------------------------------
# Initialize Agents
# ------------------------------------------------
claim_extractor = LlmAgent(
    name="claim_extractor",
    model=GEMINI_SMALL,
    instruction=CLAIM_EXTRACTION_PROMPT,
    description="Extracts factual claims from text.",
)

evidence_search_agent = LlmAgent(
    name="evidence_search_agent",
    model=GEMINI_LARGE,
    tools=[google_search],
    instruction=EVIDENCE_SEARCH_PROMPT,
    description="Searches for evidence supporting or refuting claims.",
)

fact_comparison_agent = LlmAgent(
    name="fact_comparison_agent",
    model=GEMINI_LARGE,
    instruction=FACT_COMPARISON_PROMPT,
    description="Compares each claim with evidence and outputs verdicts.",
)

data_format_agent = LlmAgent(
    name="data_format_agent",
    model=GEMINI_SMALL,
    instruction="Format the input data into a structured JSON format.",
    description="Formats data into JSON.",
    output_schema=FactCheckReport,
)


# ------------------------------------------------
# Create Sequential Pipeline
# ------------------------------------------------
fact_check_pipeline = SequentialAgent(
    name="fact_check_pipeline",
    description="Extracts claims, finds evidence, and compares them using Gemini models"
    " and formats into `FactCheckReport` schema"
    ".",
    sub_agents=[
        claim_extractor,
        evidence_search_agent,
        fact_comparison_agent,
        data_format_agent,
    ],
)

# Export the root agent for external use
root_agent = fact_check_pipeline
