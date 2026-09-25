from typing import Any, Optional
from pydantic import BaseModel, Field


class ModuleRiskResult(BaseModel):
    module: str
    risk_score: float
    risk_level: str  # "Low" | "Medium" | "High" | "Critical"
    status: str  # "success" | "warning" | "error" | "pending"
    weight: Optional[float] = 0.20
    ai_summary: Optional[str] = None


class LoanDetailsInput(BaseModel):
    company_name: str
    loan_amount: float
    loan_purpose: str
    loan_tenure_months: int
    requested_product_type: str
    requested_date: str
    currency: str = "USD"


class RiskAggregationSummaryInput(BaseModel):
    overall_risk_score: float
    overall_risk_level: str  # "Low" | "Medium" | "High" | "Critical"
    confidence_score: float = 94.0


class LoanRecommendationInput(BaseModel):
    loan_details: LoanDetailsInput
    risk_aggregation: RiskAggregationSummaryInput
    module_results: list[ModuleRiskResult] = Field(default_factory=list)
