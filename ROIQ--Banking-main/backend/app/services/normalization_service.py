from ..schemas.external_data import (
    CompanyIdentity,
    CountryRisk,
    FinancialData,
    FinancialRatios,
    FinancialStatement,
    LegalEsgData,
    MacroIndustryData,
    MarketFxData,
    NormalizedPipelinePayload,
)


class DataNormalizationService:
    """Transforms raw provider responses into the unified internal schema.

    The AI modules in `AI_MODULE_API_INTEGRATION_REPORT.md` expect standardized
    payloads. This service isolates provider-specific data shaping from downstream
    analysis and allows the backend to support multiple external providers.
    """

    def normalize_company_identity(self, raw_profile: dict[str, object]) -> CompanyIdentity:
        return CompanyIdentity(
            company_id=str(raw_profile.get("company_id", "")),
            symbol=str(raw_profile.get("symbol", "")),
            name=str(raw_profile.get("name", "")),
            exchange=raw_profile.get("exchange"),
            sector=raw_profile.get("sector"),
            industry=raw_profile.get("industry"),
            country=raw_profile.get("country"),
            description=raw_profile.get("description"),
        )

    def normalize_financial_statements(self, raw_statements: dict[str, object]) -> FinancialData:
        income_statement = [
            FinancialStatement(**statement)
            for statement in raw_statements.get("income_statement", [])
        ]
        balance_sheet = [
            FinancialStatement(**statement)
            for statement in raw_statements.get("balance_sheet", [])
        ]
        cash_flow = [
            FinancialStatement(**statement)
            for statement in raw_statements.get("cash_flow", [])
        ]

        raw_ratios = raw_statements.get("raw_ratios", {})
        ratios = FinancialRatios(
            current_ratio=raw_ratios.get("current_ratio"),
            leverage_ratio=raw_ratios.get("leverage_ratio"),
            profit_margin=raw_ratios.get("profit_margin"),
            return_on_assets=raw_ratios.get("return_on_assets"),
            debt_to_equity=raw_ratios.get("debt_to_equity"),
        )

        return FinancialData(
            income_statement=income_statement,
            balance_sheet=balance_sheet,
            cash_flow=cash_flow,
            financial_ratios=ratios,
        )

    def normalize_market_fx(self, raw_market_fx: dict[str, object]) -> MarketFxData:
        return MarketFxData(**raw_market_fx)

    def normalize_macro_industry(self, raw_macro: dict[str, object]) -> MacroIndustryData:
        raw_country_risk = raw_macro.get("country_risk", {})
        country_risk = CountryRisk(**raw_country_risk)
        return MacroIndustryData(
            gdp_growth=raw_macro.get("gdp_growth"),
            inflation_rate=raw_macro.get("inflation_rate"),
            interest_rate=raw_macro.get("interest_rate"),
            treasury_rate=raw_macro.get("treasury_rate"),
            currency_stability=raw_macro.get("currency_stability"),
            industry_growth_rate=raw_macro.get("industry_growth_rate"),
            market_sentiment=raw_macro.get("market_sentiment"),
            competition_level=raw_macro.get("competition_level"),
            country_risk=country_risk,
        )

    def normalize_legal_esg(self, raw_legal_esg: dict[str, object]) -> LegalEsgData:
        return LegalEsgData(**raw_legal_esg)

    def build_pipeline_payload(
        self,
        company_identity: CompanyIdentity,
        financial_data: FinancialData,
        market_fx_data: MarketFxData,
        macro_industry_data: MacroIndustryData,
        legal_esg_data: LegalEsgData,
    ) -> NormalizedPipelinePayload:
        return NormalizedPipelinePayload(
            company_identity=company_identity,
            financial_data=financial_data,
            market_fx_data=market_fx_data,
            macro_industry_data=macro_industry_data,
            legal_esg_data=legal_esg_data,
        )
