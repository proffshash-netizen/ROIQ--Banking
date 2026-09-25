from typing import Any, Optional
from pydantic import BaseModel, Field


class MarketFxData(BaseModel):
    var_95: float
    expected_shortfall: float
    pnl_volatility: float
    tail_risk_ratio: float
    currency_exposure: float
    hedged_exposure: float
    unhedged_exposure: float
    fx_volatility: float
    cross_currency_basis: float
    security_identifiers: list[str] = Field(default_factory=list)


class MarketRiskInput(BaseModel):
    company_id: str
    market_fx_data: MarketFxData


class CreditRiskInput(BaseModel):
    credit_history: dict[str, Any] = Field(default_factory=dict)
    existing_debt: dict[str, Any] = Field(default_factory=dict)
    default_history: dict[str, Any] = Field(default_factory=dict)
    credit_rating: str = "BBB"
    debt_ratios: dict[str, Any] = Field(default_factory=dict)


class CreditRiskServiceResponse(BaseModel):
    marketRisk: MarketRiskInput
    creditRisk: CreditRiskInput


class CreditRiskAnalyzeRequest(BaseModel):
    requested_loan: Optional[float] = None
    tenure_months: Optional[int] = 36
    loan_purpose: Optional[str] = "Corporate Expansion & Working Capital"
    include_explainability: Optional[bool] = True


class HumanReviewRequest(BaseModel):
    approved: bool = Field(..., description="Whether risk officer authorizes the credit facility")
    notes: str = Field(..., description="Risk officer audit and justification notes")
    adjusted_category: Optional[str] = Field(default=None, description="Optional officer override category")
    officer: Optional[str] = Field(default="Senior Risk Officer", description="Name/title of approving officer")


class LoanRecommendationResult(BaseModel):
    decision: str  # "APPROVE" | "APPROVE_WITH_CONDITIONS" | "REJECT" | "FURTHER_REVIEW"
    requested_amount: float
    approved_amount: float
    pricing_spread: str
    covenants: list[str] = Field(default_factory=list)
    tenure_months: int = 36
    decision_date: Optional[str] = None


class CreditRiskAnalyzeResponse(BaseModel):
    company_id: str
    company_name: str
    credit_score: float
    risk_category: str  # "Low" | "Medium" | "High" | "Critical"
    credit_rating: str
    probability_of_default: float
    metrics: dict[str, Any] = Field(default_factory=dict)
    risk_factors: list[str] = Field(default_factory=list)
    positive_factors: list[str] = Field(default_factory=list)
    ai_insights: list[str] = Field(default_factory=list)
    recommendation: Optional[LoanRecommendationResult] = None
    human_review_required: bool = False
    human_approval: Optional[dict[str, Any]] = None
    workflow_status: str  # "COMPLETED" | "PAUSED_FOR_APPROVAL" | "RUNNING"
    current_node: str
    thread_id: str
    chart_data: dict[str, Any] = Field(default_factory=dict)
    is_llm_generated: bool = False
    source: str = Field(default="INTERNAL", description="Data provenance: INTERNAL | FRED | FMP | FALLBACK")
    source_timestamp: Optional[str] = Field(default=None, description="ISO timestamp when source data was verified")

