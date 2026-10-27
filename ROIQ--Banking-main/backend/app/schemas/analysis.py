from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    company_id: str = Field(min_length=1)
    include_risk: bool = True
    include_explainability: bool = False


class AnalysisResponse(BaseModel):
    company_id: str
    summary: str
    risk_score: float
    status: str = "pending"
