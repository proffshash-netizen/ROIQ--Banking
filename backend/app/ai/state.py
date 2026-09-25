from typing import Any, Optional, TypedDict


class HumanApproval(TypedDict, total=False):
    """Payload representing Human-in-the-Loop decision from a Risk Officer."""
    approved: bool
    notes: str
    adjusted_category: Optional[str]
    officer: Optional[str]
    timestamp: Optional[str]


class LoanAIState(TypedDict, total=False):
    """
    Shared state passed between LangGraph nodes
    for the banking loan analysis workflow with HITL approval.
    """
    thread_id: str
    company_id: str
    company_name: str
    sector: str
    customer_data: dict[str, Any]
    financial_metrics: dict[str, Any]
    credit_risk: dict[str, Any]
    risk_category: str  # "Low" | "Medium" | "High" | "Critical"
    decision_score: float
    human_approval: HumanApproval
    loan_recommendation: dict[str, Any]
    recommendations: list[str]
    ai_insights: list[str]
    chart_data: dict[str, Any]
    current_node: str  # "ingest" | "evaluate" | "human_review" | "recommend"
    status: str  # "RUNNING" | "PAUSED_FOR_APPROVAL" | "COMPLETED" | "ERROR"
    error: Optional[str]