from typing import Any

from ..interfaces.external_provider_service import ExternalProviderService
from ..services.normalization_service import DataNormalizationService
from ..schemas.external_data import (
    ExternalDataRequest,
    NormalizedDataResponse,
)


class ExternalDataPipelineService:
    """External API intake and normalization pipeline.

    This service is responsible for:
    - invoking external provider clients,
    - validating raw API responses,
    - normalizing those responses into the AI payload contract,
    - returning a validated downstream payload for LangGraph/Groq integration.
    """

    def __init__(self, provider_service: ExternalProviderService) -> None:
        self.provider_service = provider_service
        self.normalizer = DataNormalizationService()

    async def build_normalized_payload(
        self, request: ExternalDataRequest
    ) -> NormalizedDataResponse:
        symbol = request.symbol or request.company_id

        company_profile = await self.provider_service.fetch_company_profile(
            request.company_id, symbol
        )
        raw_financials = await self.provider_service.fetch_financial_statements(
            request.company_id, symbol
        )
        raw_market_fx = await self.provider_service.fetch_market_fx(symbol)
        raw_macro = await self.provider_service.fetch_macro_indicators()
        raw_legal_esg = await self.provider_service.fetch_legal_esg(
            request.company_id, symbol
        )

        company_identity = self.normalizer.normalize_company_identity(company_profile)
        financial_data = self.normalizer.normalize_financial_statements(raw_financials)
        market_fx_data = self.normalizer.normalize_market_fx(raw_market_fx)
        macro_industry_data = self.normalizer.normalize_macro_industry(raw_macro)
        legal_esg_data = self.normalizer.normalize_legal_esg(raw_legal_esg)

        pipeline_payload = self.normalizer.build_pipeline_payload(
            company_identity=company_identity,
            financial_data=financial_data,
            market_fx_data=market_fx_data,
            macro_industry_data=macro_industry_data,
            legal_esg_data=legal_esg_data,
        )

        return NormalizedDataResponse(pipeline_payload=pipeline_payload)
