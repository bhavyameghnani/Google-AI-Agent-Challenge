from .models import CompanyProfile
from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from google.adk.tools import google_search
from .prompts import (
    FINANCIAL_DATA_EXTRACTION_INSTRUCTIONS,
    LEADERSHIP_PROFILE_EXTRACTION_INSTRUCTIONS,
    MARKET_DATA_EXTRACTION_INSTRUCTIONS,
    REPUTATION_DATA_EXTRACTION_INSTRUCTIONS,
    COMPANY_BASIC_INFO_EXTRACTION_INSTRUCTIONS,
    COMPANY_PROFILE_DATA_SYNTHESIS_INSTRUCTIONS,
)
from gemini_model_config import GEMINI_SMALL


# Enhanced Financial Agent with Citations
financial_agent = LlmAgent(
    name="FinancialAgent",
    model=GEMINI_SMALL,
    instruction=FINANCIAL_DATA_EXTRACTION_INSTRUCTIONS,
    description="Extracts financial metrics with mandatory source citations.",
    tools=[google_search],
    output_key="financial_data",
)

# Enhanced People Agent with Citations
people_agent = LlmAgent(
    name="PeopleAgent",
    model=GEMINI_SMALL,
    instruction=LEADERSHIP_PROFILE_EXTRACTION_INSTRUCTIONS,
    description="Extracts leadership profiles with source citations.",
    tools=[google_search],
    output_key="people_data",
)

# Enhanced Market Agent with Citations
market_agent = LlmAgent(
    name="MarketAgent",
    model=GEMINI_SMALL,
    instruction=MARKET_DATA_EXTRACTION_INSTRUCTIONS,
    description="Extracts market data with mandatory source citations.",
    tools=[google_search],
    output_key="market_data",
)

# Enhanced Reputation Agent with News Citations
reputation_agent = LlmAgent(
    name="ReputationAgent",
    model=GEMINI_SMALL,
    instruction=REPUTATION_DATA_EXTRACTION_INSTRUCTIONS,
    description="Extracts reputation data with mandatory news citations.",
    tools=[google_search],
    output_key="reputation_data",
)

# Keep existing company_info_agent unchanged
company_info_agent = LlmAgent(
    name="CompanyInfoAgent",
    model=GEMINI_SMALL,
    instruction=COMPANY_BASIC_INFO_EXTRACTION_INSTRUCTIONS,
    description="Extracts basic company information with selective citations.",
    tools=[google_search],
    output_key="company_info_data",
)

# Create the ParallelAgent
parallel_extraction_agent = ParallelAgent(
    name="ParallelCompanyDataExtraction",
    sub_agents=[
        company_info_agent,
        financial_agent,
        people_agent,
        market_agent,
        reputation_agent,
    ],
    description="Runs multiple company data extraction agents in parallel with citation requirements.",
)

# Enhanced Data Synthesis Agent
data_synthesis_agent = LlmAgent(
    name="DataSynthesisAgent",
    model=GEMINI_SMALL,
    instruction=COMPANY_PROFILE_DATA_SYNTHESIS_INSTRUCTIONS,
    description="Synthesizes company data into structured profile with cleaned citations.",
    output_schema=CompanyProfile,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

# Create the SequentialAgent
company_analysis_pipeline = SequentialAgent(
    name="CompanyAnalysisPipeline",
    sub_agents=[parallel_extraction_agent, data_synthesis_agent],
    description="Coordinates parallel data extraction with citations and synthesizes comprehensive company profile.",
)

# Main agent
root_agent = company_analysis_pipeline
