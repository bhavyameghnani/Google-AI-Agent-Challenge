from pydantic import BaseModel

from evaluation_score.agent import EvaluationScoreComplete


class CompetitorInfo(BaseModel):
    competitor_name: str
    last_funding: str
    stage: str
    total_funding: str
    location: str


class CompetitorInfoWithScore(BaseModel):
    competitor_name: str
    last_funding: str
    stage: str
    total_funding: str
    location: str
    evaluation_score: EvaluationScoreComplete


class AllCompetitorsInfo(BaseModel):
    competitors: list[CompetitorInfo]


class AllCompetitorsInfoWithScore(BaseModel):
    competitors: list[CompetitorInfoWithScore]
