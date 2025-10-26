from typing import Optional

from pydantic import BaseModel, Field, conlist


class EvaluationScoreComplete(BaseModel):
    """
    Represents the complete evaluation score data for a startup.
    """

    revenue_growth_score: int = Field(
        ..., description="Score based on revenue growth percentage."
    )
    revenue_growth_score_rationale: str = Field(
        ..., description="Rationale for the revenue growth score."
    )
    financial_strength_score: int = Field(
        ..., description="Score based on financial strength metrics."
    )
    financial_strength_score_rationale: str = Field(
        ..., description="Rationale for the financial strength score."
    )
    industry_health_score: int = Field(
        ..., description="Score based on industry health and market factors."
    )
    industry_health_score_rationale: str = Field(
        ..., description="Rationale for the industry health score."
    )
    founder_background_score: int = Field(
        ...,
        description="Score based on founder background evaluation.",
    )
    founder_background_score_rationale: str = Field(
        ..., description="Rationale for the founder background score."
    )


class FounderBackgroundData(BaseModel):
    """
    Represents the background and profile data for a single founder.
    The scores are based on the rubric provided in the document[cite: 4].
    """

    founder_name: str = Field(
        None,
        description="Name of the founder.",
    )
    education_prestige: Optional[str]
    past_startup_experience: Optional[str]
    domain_expertise: Optional[str]
    leadership_roles: Optional[str]
    network_strength: Optional[str]
    reputation_signals: Optional[str]


class MultipleFoundersData(BaseModel):
    """
    Represents the background and profile data for multiple founders.
    """

    founders: conlist(FounderBackgroundData, min_length=1) = Field(
        ...,
        description="List of founder background data.",
    )


class FounderBackgroundScore(BaseModel):
    """
    Represents the background and profile data for a single founder.
    The scores are based on the rubric provided in the document[cite: 4].
    """

    education_prestige_score: int = Field(
        ...,
        description="Score based on educational background and university prestige (e.g., Top-tier -> 1000).",
    )
    past_startup_experience_score: int = Field(
        ...,
        description="Score based on prior startup experience (e.g., Successful exit -> 1000).",
    )
    domain_expertise_score: int = Field(
        ...,
        description="Score based on years of experience in the relevant domain (e.g., 10+ yrs -> 1000).",
    )
    leadership_roles_score: int = Field(
        ...,
        description="Score based on past leadership roles (e.g., CXO in large firm -> 1000).",
    )
    network_strength_score: int = Field(
        ...,
        description="Score based on connections to investors and accelerators (e.g., Multiple Tier-1 investors -> 1000).",
    )
    reputation_signals_score: int = Field(
        ...,
        description="Score based on media presence, awards, and thought leadership (e.g., Positive media -> 1000).",
    )


class MultipleFoundersScore(BaseModel):
    """
    Represents the background and profile data for multiple founders.
    """

    founders: conlist(FounderBackgroundScore, min_length=1) = Field(
        ...,
        description="List of founder background score.",
    )
