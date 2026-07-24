from typing import Any

from ..interfaces.ai_analysis_service import AIAnalysisService
from ..interfaces.financial_data_service import FinancialDataService
from ..schemas.analysis import AnalysisRequest, AnalysisResponse


class AnalysisService:
    """Thin orchestration service that routes analysis requests to future integrations.

    TODO: Implemented by Backend Platform Engineer with future integration points.
    """

    def __init__(self, financial_data_service: FinancialDataService, ai_analysis_service: AIAnalysisService) -> None:
        self.financial_data_service = financial_data_service
        self.ai_analysis_service = ai_analysis_service

    async def analyze_company(self, request: AnalysisRequest) -> AnalysisResponse:
        company = await self.financial_data_service.get_company(request.company_id)
        risk_result = await self.ai_analysis_service.calculate_risk(request.company_id, {"company": company})
        return AnalysisResponse(
            company_id=request.company_id,
            summary=f"Analysis placeholder for {company.get('name', request.company_id)}",
            risk_score=float(risk_result.get("risk_score", 0.0)),
            status="ready",
        )

