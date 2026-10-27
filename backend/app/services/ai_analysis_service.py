from typing import Any

from ..interfaces.ai_analysis_service import AIAnalysisService
from ..ai.graph import loan_ai_graph


class AIAnalysisServiceImpl(AIAnalysisService):
    """
    Concrete AI analysis service that connects the backend
    to the LangGraph loan analysis workflow.
    """

    async def calculate_risk(
        self,
        company_id: str,
        context: dict[str, Any] | None = None
    ) -> dict[str, Any]:

        context = context or {}

        # Get customer data for the LangGraph
        customer_data = context.get("customer_data", {})

        # Support the existing AnalysisService structure
        # where company data is passed inside "company".
        if not customer_data:
            customer_data = context.get("company", {})

        # Run the LangGraph workflow
        thread_id = str(customer_data.get("company_id") or company_id or "default_thread")
        result = loan_ai_graph.invoke(
            {"customer_data": customer_data, "company_id": company_id},
            config={"configurable": {"thread_id": thread_id}}
        )

        return {
            "risk_score": result.get("decision_score", 0.0),
            "credit_risk": result.get("credit_risk", {}),
            "decision_score": result.get("decision_score", 0.0),
        }

    async def analyze_company(
        self,
        company_id: str,
        context: dict[str, Any] | None = None
    ) -> dict[str, Any]:

        risk_result = await self.calculate_risk(
            company_id,
            context
        )

        return {
            "company_id": company_id,
            "credit_risk": risk_result.get("credit_risk", {}),
            "decision_score": risk_result.get("decision_score", 0.0),
        }

    async def due_diligence(
        self,
        company_id: str,
        context: dict[str, Any] | None = None
    ) -> dict[str, Any]:

        return {
            "company_id": company_id,
            "status": "pending",
            "message": "Due diligence workflow will be connected later."
        }

    async def explainability(
        self,
        company_id: str,
        context: dict[str, Any] | None = None
    ) -> dict[str, Any]:

        risk_result = await self.calculate_risk(
            company_id,
            context
        )

        return {
            "company_id": company_id,
            "risk_level": risk_result.get("credit_risk", {}).get(
                "risk_level",
                "unknown"
            ),
            "decision_score": risk_result.get(
                "decision_score",
                0.0
            ),
            "explanation": "Decision generated using the LangGraph credit-risk workflow."
        }