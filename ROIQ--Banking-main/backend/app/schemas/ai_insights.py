from typing import Any, Optional
from pydantic import BaseModel, Field


class InsightItem(BaseModel):
    category: str  # "FACT" | "CALCULATED METRIC" | "AI INTERPRETATION" | "RECOMMENDATION"
    title: str
    detail: str
    supporting_metrics: Optional[dict[str, Any]] = None
    severity: Optional[str] = "info"  # "info" | "warning" | "critical" | "positive"


class AIInsightsResponse(BaseModel):
    company_id: str
    company_name: str
    sector: str
    credit_score: float
    risk_level: str
    summary: str
    facts: list[InsightItem] = Field(default_factory=list)
    calculated_metrics: list[InsightItem] = Field(default_factory=list)
    ai_interpretations: list[InsightItem] = Field(default_factory=list)
    recommendations: list[InsightItem] = Field(default_factory=list)
    human_review_required: bool = False
    review_prompts: list[str] = Field(default_factory=list)
    is_llm_generated: bool = False
    model_name: Optional[str] = None
