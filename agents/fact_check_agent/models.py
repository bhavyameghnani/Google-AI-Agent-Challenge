
from pydantic import BaseModel, Field
from typing import List, Optional

# --- New FactCheckV2 Models for statement_checked, verdict, etc. ---
class EvidenceSource(BaseModel):
    source_name: Optional[str] = Field(None, description="Name of the evidence source")
    url: Optional[str] = Field(None, description="Source URL")

class FactCheckV2(BaseModel):
    statement_checked: str = Field(..., description="The statement that was fact-checked")
    verdict: str = Field(..., description="True/False/Partially True/Other verdicts")
    confidence_score: Optional[float] = Field(None, description="Confidence score (0-1)")
    reasoning: Optional[str] = Field(None, description="Reasoning for the verdict")
    evidence_sources: List[EvidenceSource] = Field(default_factory=list, description="List of evidence sources")
    correction_if_false: Optional[str] = Field(None, description="Correction if the statement is false")
from pydantic import BaseModel, Field
from typing import List, Optional


class Claim(BaseModel):
    id: Optional[str] = Field(None, description="Unique claim id")
    text: str = Field(..., description="Extracted factual claim text")
    normalized_field: Optional[str] = Field(
        None, description="If claim maps to a canonical field (e.g., year_founded)"
    )
    extracted_value: Optional[str] = Field(None, description="Value parsed from PDF for claim")
    location: Optional[str] = Field(None, description="Page/line location in PDF")


class EvidenceItem(BaseModel):
    url: Optional[str] = Field(None, description="Source URL")
    title: Optional[str] = Field(None, description="Page title or source name")
    snippet: Optional[str] = Field(None, description="Short excerpt supporting/refuting the claim")


class ClaimWithEvidence(BaseModel):
    claim: Claim = Field(...)
    evidences: List[EvidenceItem] = Field(default_factory=list)


class FactCheckResult(BaseModel):
    claim: Claim = Field(...)
    verdict: str = Field(..., description="Supported | Contradicted | Unsubstantiated")
    evidences: List[EvidenceItem] = Field(default_factory=list)
    corrected_value: Optional[str] = Field(None, description="Suggested correct value when contradicted")
    reasoning: Optional[str] = Field(None, description="Brief explanation of the verdict")


class FactCheckReport(BaseModel):
    company_name: Optional[str] = Field(None)
    source: Optional[str] = Field(
        "pdf", description="Original source type; e.g. 'pdf' or 'file'"
    )
    claims: List[FactCheckResult] = Field(default_factory=list)
    summary: Optional[str] = Field(None)
