from pydantic import BaseModel

from evaluation_score.agent import EvaluationScoreComplete


class CompanyDetails(BaseModel):
    company_name: str
    last_funding: str
    stage: str
    total_funding: str
    location: str


class CompetitorInfoWithScore(BaseModel):
    company_details: CompanyDetails
    evaluation_score: EvaluationScoreComplete


class AllCompetitorsInfoWithScore(BaseModel):
    competitors: list[CompetitorInfoWithScore]
