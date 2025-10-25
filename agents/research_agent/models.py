from pydantic import BaseModel, Field
from typing import List, Optional


# --- Enhanced Pydantic Models with Citations ---


class CitedValue(BaseModel):
    """Base model for values that need citations."""

    value: str = Field(description="The actual data value")
    source_url: Optional[str] = Field(description="URL to the source", default=None)
    source_name: Optional[str] = Field(description="Name of the source", default=None)


class CompanyBasicInfo(BaseModel):
    """Basic company information model."""

    company_name: str = Field(description="Official company name")
    logo_url: Optional[str] = Field(description="URL to company logo", default=None)
    headquarters_location: str = Field(
        description="City, state, and country of headquarters"
    )
    year_founded: Optional[int] = Field(
        description="Year the company was founded", default=None
    )
    company_type: str = Field(description="Private, Public, or Subsidiary")
    industry_sector: str = Field(description="Primary industry classification")
    business_model: str = Field(description="B2B, B2C, SaaS, Marketplace, etc.")
    company_stage: CitedValue = Field(description="Company stage with source")
    employee_count: Optional[CitedValue] = Field(
        description="Employee count with source", default=None
    )
    website_url: str = Field(description="Official website URL")
    company_description: str = Field(description="Short description or tagline")


class FinancialData(BaseModel):
    """Financial and funding information with citations."""

    total_equity_funding: Optional[CitedValue] = Field(
        description="Total funding with source", default=None
    )
    latest_funding_round: Optional[CitedValue] = Field(
        description="Latest round with source", default=None
    )
    valuation: Optional[CitedValue] = Field(
        description="Valuation with source", default=None
    )
    revenue_growth_rate: Optional[CitedValue] = Field(
        description="Growth rate with source", default=None
    )
    financial_strength: str = Field(description="Assessment of financial health")
    key_investors: List[str] = Field(description="List of major investors", default=[])


class KeyPerson(BaseModel):
    """Key person with citation."""

    name: str = Field(description="Person's full name")
    role: str = Field(description="Job title or role")
    background: str = Field(description="Brief professional background")
    source_url: Optional[str] = Field(
        description="Source URL (LinkedIn, company page)", default=None
    )


class PeopleData(BaseModel):
    """People and leadership information."""

    key_people: List[KeyPerson] = Field(
        description="Key leadership with sources", default=[]
    )
    employee_growth_rate: Optional[str] = Field(
        description="Rate of team growth", default=None
    )
    hiring_trends: str = Field(description="Current hiring patterns and insights")


class MarketData(BaseModel):
    """Market data with citations for key claims."""

    market_size: Optional[CitedValue] = Field(
        description="TAM with source", default=None
    )
    competitive_landscape: CitedValue = Field(
        description="Competitor analysis with source"
    )
    market_position: str = Field(description="Company's market position")
    competitive_advantages: List[CitedValue] = Field(
        description="Key differentiators with sources", default=[]
    )
    product_market_fit: str = Field(description="Assessment of product-market fit")


class NewsItem(BaseModel):
    """Individual news item with citation."""

    headline: str = Field(description="News headline or summary")
    source_url: str = Field(description="URL to the news article")
    source_name: str = Field(description="Publication name")
    date: Optional[str] = Field(description="Publication date", default=None)


class ReputationData(BaseModel):
    """Reputation data with proper citations."""

    customer_satisfaction: Optional[CitedValue] = Field(
        description="Customer satisfaction with source", default=None
    )
    news_mentions_count: Optional[int] = Field(
        description="Number of recent mentions", default=None
    )
    notable_news: List[NewsItem] = Field(
        description="Key news items with links", default=[]
    )
    partnerships: List[CitedValue] = Field(
        description="Partnerships with announcement sources", default=[]
    )
    brand_sentiment: str = Field(description="Overall brand sentiment analysis")


class CompanyProfile(BaseModel):
    """Complete company profile model."""

    company_info: CompanyBasicInfo = Field(description="Basic company information")
    financial_data: FinancialData = Field(
        description="Financial and funding information"
    )
    people_data: PeopleData = Field(description="Leadership and team information")
    market_data: MarketData = Field(description="Market position and competitive data")
    reputation_data: ReputationData = Field(
        description="Reputation and customer information"
    )
    extraction_summary: str = Field(description="Key insights and overall assessment")
