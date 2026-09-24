from typing import Any, TypedDict


class LoanAIState(TypedDict, total=False):
    """
    Shared state passed between LangGraph nodes
    for the banking loan analysis workflow.
    """

    customer_data: dict[str, Any]

    credit_risk: dict[str, Any]

    decision_score: float

    loan_recommendation: dict[str, Any]

    ai_insights: list[str]

    error: str