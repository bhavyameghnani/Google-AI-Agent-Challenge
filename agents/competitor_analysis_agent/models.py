from pydantic import BaseModel

from evaluation_score.agent import EvaluationScoreComplete


class CompetitorInfo(BaseModel):
    competitor_name: str
    last_funding: str  # derived attribute
    stage: str
    total_funding: str  # derived attribute
    location: str

class CompetitorInfoWithScore(BaseModel):
    competitor_name: str
    # funding_rounds: list[FundingRound]
    last_funding: str  # derived attribute
    stage: str
    total_funding: str  # derived attribute
    location: str
    evaluation_score: EvaluationScoreComplete
    
class AllCompetitorsInfo(BaseModel):
    competitors: list[CompetitorInfo]

class AllCompetitorsInfoWithScore(BaseModel):
    competitors: list[CompetitorInfoWithScore]