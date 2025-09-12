from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from google.adk.tools import google_search
from pydantic import BaseModel, Field
from typing import List, Optional

# Model configuration - replace with your preferred model
GEMINI_MODEL = "gemini-2.0-flash"

# --- Pydantic Models for Structured Output ---

class CompanyBasicInfo(BaseModel):
    """Basic company information model."""
    company_name: str = Field(description="Official company name")
    logo_url: Optional[str] = Field(description="URL to company logo", default=None)
    headquarters_location: str = Field(description="City, state, and country of headquarters")
    year_founded: Optional[int] = Field(description="Year the company was founded", default=None)
    company_type: str = Field(description="Private, Public, or Subsidiary")
    industry_sector: str = Field(description="Primary industry classification")
    business_model: str = Field(description="B2B, B2C, SaaS, Marketplace, etc.")
    company_stage: str = Field(description="Seed, Series A, Growth, Pre-IPO, Public, etc.")
    employee_count: Optional[int] = Field(description="Approximate number of employees", default=None)
    website_url: str = Field(description="Official website URL")
    company_description: str = Field(description="Short description or tagline")

class FinancialData(BaseModel):
    """Financial and funding information model."""
    total_equity_funding: Optional[str] = Field(description="Total capital raised from investors", default=None)
    latest_funding_round: Optional[str] = Field(description="Most recent funding round details", default=None)
    valuation: Optional[str] = Field(description="Company valuation if available", default=None)
    revenue_growth_rate: Optional[str] = Field(description="Year-over-year revenue growth", default=None)
    financial_strength: str = Field(description="Assessment of financial health")
    key_investors: List[str] = Field(description="List of major investors", default=[])

class KeyPerson(BaseModel):
    """Individual key person model."""
    name: str = Field(description="Person's full name")
    role: str = Field(description="Job title or role")
    background: str = Field(description="Brief professional background")

class PeopleData(BaseModel):
    """People and leadership information model."""
    key_people: List[KeyPerson] = Field(description="Key leadership team members", default=[])
    employee_growth_rate: Optional[str] = Field(description="Rate of team growth", default=None)
    hiring_trends: str = Field(description="Current hiring patterns and insights")

class MarketData(BaseModel):
    """Market position and competitive information model."""
    market_size: Optional[str] = Field(description="Total addressable market size", default=None)
    competitive_landscape: str = Field(description="Analysis of main competitors")
    market_position: str = Field(description="Company's position in the market")
    competitive_advantages: List[str] = Field(description="Key differentiators", default=[])
    product_market_fit: str = Field(description="Assessment of product-market fit")

class ReputationData(BaseModel):
    """Reputation and customer information model."""
    customer_satisfaction: Optional[str] = Field(description="Customer satisfaction indicators", default=None)
    news_mentions_count: Optional[int] = Field(description="Number of recent news mentions", default=None)
    notable_news: List[str] = Field(description="Key recent news items", default=[])
    partnerships: List[str] = Field(description="Notable business partnerships", default=[])
    brand_sentiment: str = Field(description="Overall brand sentiment analysis")

class CompanyProfile(BaseModel):
    """Complete company profile model."""
    company_info: CompanyBasicInfo = Field(description="Basic company information")
    financial_data: FinancialData = Field(description="Financial and funding information")
    people_data: PeopleData = Field(description="Leadership and team information")
    market_data: MarketData = Field(description="Market position and competitive data")
    reputation_data: ReputationData = Field(description="Reputation and customer information")
    extraction_summary: str = Field(description="Key insights and overall assessment")

# Company Basic Information Agent
company_info_agent = LlmAgent(
    name="CompanyInfoAgent",
    model=GEMINI_MODEL,
    instruction="""You are an AI Research Assistant specializing in company basic information extraction.

        For the given company, research and extract the following basic information:
        - Company Name
        - Headquarters Location (City, State, Country)
        - Year Founded
        - Company Type (Private/Public/Subsidiary)
        - Industry/Sector classification
        - Business Model (B2B/B2C/SaaS/Marketplace/etc.)
        - Company Stage (Seed/Series A/Growth/Pre-IPO/Public/etc.)
        - Employee Headcount (approximate number)
        - Official Website URL
        - Company Description/Tagline (one-two liner about exactly what the company does or offers)

        Use Google Search to find official sources like the company website, LinkedIn company page, Crunchbase, or business registries.

        Format your response as structured data with clear labels. Be factual and cite your sources.
        Output only the extracted information in a clear, organized format.""",
    description="Extracts basic company information and identity details.",
    tools=[google_search],
    output_key="company_info_data"
)

# Financial and Funding Agent
financial_agent = LlmAgent(
    name="FinancialAgent", 
    model=GEMINI_MODEL,
    instruction="""You are an AI Research Assistant specializing in company financial and funding information.

        For the given company, research and extract the following financial data:
        - Total Equity Funding raised (all funding rounds combined)
        - Latest funding round details (amount, date, round type)
        - Valuation (if available)
        - Revenue information (if publicly available)
        - Revenue Growth Rate (year-over-year if available)
        - Financial health indicators
        - Profitability status
        - Key investors and investment firms
        - Funding history timeline
        - Growth momentum indicators

        Use Google Search to find information from sources like Crunchbase, PitchBook, company press releases, SEC filings (for public companies), and financial news.

        Focus on factual, quantitative data. If specific numbers aren't available, indicate this clearly.
        Output only the extracted financial information in a structured format.""",
    description="Extracts company funding, financial metrics, and growth data.",
    tools=[google_search],
    output_key="financial_data"
)

# People and Leadership Agent
people_agent = LlmAgent(
    name="PeopleAgent",
    model=GEMINI_MODEL, 
    instruction="""You are an AI Research Assistant specializing in company leadership and team information.

        For the given company, research and extract the following people-related data:
        - Key Leadership (CEO, CTO, COO, Founders with names and brief backgrounds)
        - Board members and advisors (if available)
        - Employee growth rate and hiring trends
        - Recent key hires or departures
        - Company culture insights
        - Team size by department (if available)
        - Hiring patterns and job openings
        - Leadership experience and backgrounds
        - Notable alumni or former employees

        Use Google Search to find information from LinkedIn profiles, company About pages, press releases, and professional networks.

        Provide brief profiles for key people including their role, background, and tenure.
        Output only the extracted people and hiring information in a structured format.""",
            description="Extracts leadership profiles, team information, and hiring insights.",
    tools=[google_search],
    output_key="people_data"
)

# Market Position and Competition Agent
market_agent = LlmAgent(
    name="MarketAgent",
    model=GEMINI_MODEL,
    instruction="""You are an AI Research Assistant specializing in market analysis and competitive positioning.

        For the given company, research and extract the following market information:
        - Market size and Total Addressable Market (TAM)
        - Industry health and growth trends
        - Main competitors and competitive landscape
        - Market share (if available)
        - Product-Market Fit indicators
        - Differentiation and unique value proposition
        - Market position and ranking
        - Industry trends affecting the company
        - Competitive advantages
        - Market challenges and opportunities
        - Customer segments and target markets

        Use Google Search to find information from industry reports, market research, competitor analysis, and business publications.

        Focus on the company's position within its industry and market dynamics.
        Output only the extracted market and competitive information in a structured format.""",
    description="Extracts market position, competitive landscape, and industry analysis.",
    tools=[google_search],
    output_key="market_data"
)

# Reputation and Customer Voice Agent
reputation_agent = LlmAgent(
    name="ReputationAgent",
    model=GEMINI_MODEL,
    instruction="""You are an AI Research Assistant specializing in company reputation and customer sentiment analysis.

        For the given company, research and extract the following reputation data:
        - Recent news mentions (count and notable articles)
        - Customer satisfaction indicators (reviews, ratings, testimonials)
        - Customer retention and renewal rates (if available)
        - Brand sentiment analysis
        - Notable partnerships and business relationships
        - Awards and recognitions
        - Press coverage sentiment (positive/negative/neutral)
        - Customer case studies and success stories
        - Public relations events and announcements
        - Social media presence and engagement
        - Crisis or controversy mentions
        - Industry recognition and rankings

        Use Google Search to find information from news outlets, review sites, social media, customer testimonials, and industry publications.

        Focus on public perception, customer feedback, and brand reputation indicators.
        Output only the extracted reputation and customer voice information in a structured format.""",
    description="Extracts reputation data, customer sentiment, and news mentions.",
    tools=[google_search],
    output_key="reputation_data"
)

# Create the ParallelAgent (Runs data extraction agents concurrently) 
parallel_extraction_agent = ParallelAgent(
    name="ParallelCompanyDataExtraction",
    sub_agents=[
        company_info_agent,
        financial_agent,
        people_agent,
        market_agent,
        reputation_agent
    ],
    description="Runs multiple company data extraction agents in parallel to gather comprehensive information."
)

#  3. Define the Data Synthesis Agent- Gather and structure Data (Runs after parallel extraction)
data_synthesis_agent = LlmAgent(
    name="DataSynthesisAgent",
    model=GEMINI_MODEL,
    instruction="""You are an AI Assistant responsible for combining company research findings into a comprehensive, structured company profile.

        Your task is to synthesize the following research data into a complete company analysis report. Structure your response with clear sections and ensure all information is properly attributed.

        **IMPORTANT: Your response MUST be grounded exclusively on the information provided below. Do NOT add external knowledge or assumptions.**

        **Input Data:**

        **Company Information:**
        {company_info_data}

        **Financial Data:**
        {financial_data}

        **People & Leadership:**
        {people_data}

        **Market Analysis:**
        {market_data}

        **Reputation & Customer Voice:**
        {reputation_data}

        **Output Format:**

        # Company Profile: [Company Name]

        ## Executive Summary
        [2-3 sentence overview of the company based on collected data]

        ## Company Overview
        - **Company Name:** 
        - **Founded:** 
        - **Headquarters:** 
        - **Industry:** 
        - **Business Model:** 
        - **Stage:** 
        - **Employees:** 
        - **Website:** 

        ## Financial Profile
        - **Total Funding:** 
        - **Latest Round:** 
        - **Valuation:** 
        - **Revenue Growth:** 
        - **Financial Health:** 
        - **Key Investors:** 

        ## Leadership & Team
        - **Key Leadership:** 
        - **Team Growth:** 
        - **Hiring Trends:** 

        ## Market Position
        - **Market Size:** 
        - **Competitors:** 
        - **Market Share:** 
        - **Competitive Advantages:** 

        ## Reputation & Customer Voice
        - **Customer Satisfaction:** 
        - **Recent News:** 
        - **Partnerships:** 
        - **Brand Sentiment:** 

        ## Key Insights & Summary
        [Synthesize the most important findings and overall company assessment]

        Output only the structured company profile following this exact format. Use bullet points and clear formatting for readability.""",
    description="Synthesizes all extracted company data into a comprehensive structured profile.",
    output_schema=CompanyProfile,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True
)

# 4. Create the SequentialAgent (Orchestrates the overall workflow)
company_analysis_pipeline = SequentialAgent(
    name="CompanyAnalysisPipeline",
    sub_agents=[
        parallel_extraction_agent,  # First: Extract data in parallel
        data_synthesis_agent        # Then: Synthesize into final report
    ],
    description="Coordinates parallel company data extraction and synthesizes results into a comprehensive company profile."
)

# Main agent that will be executed
root_agent = company_analysis_pipeline