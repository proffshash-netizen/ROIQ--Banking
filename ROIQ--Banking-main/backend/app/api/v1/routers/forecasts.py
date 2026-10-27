from typing import Any
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.forecasts import (
    BalanceSheetData,
    CashFlowStatementData,
    CorporateFinancialInput,
    FinancialRatiosData,
    ForecastResponse,
    IncomeStatementData,
    MacroIndustryDetail,
    MacroIndustryInput,
    ProfitabilityTrendPoint,
    RevenueTrendPoint,
)
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Forecasts"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get("/{company_id}", response_model=dict, summary="Get company financial forecasts and macro trends")
async def get_forecasts(company_id: str) -> dict:
    f_ctx = company_service.get_financial_context(company_id)
    rev = float(f_ctx.get("revenue") or 1_500_000_000.0)
    ebitda = float(f_ctx.get("ebitda") or rev * 0.22)
    net_inc = float(f_ctx.get("net_income") or ebitda * 0.55)
    total_debt = float(f_ctx.get("total_debt") or rev * 0.60)
    equity = float(f_ctx.get("equity") or total_debt * 0.85)
    total_assets = total_debt + equity

    # Generate deterministic trend and forward projections (2022 to 2026F)
    growth_rates = [0.82, 0.90, 0.96, 1.0, 1.08]
    periods = ["2022", "2023", "2024", "2025", "2026 (F)"]

    rev_trends = [
        RevenueTrendPoint(period=p, value=round(rev * g))
        for p, g in zip(periods, growth_rates)
    ]
    prof_trends = [
        ProfitabilityTrendPoint(
            period=p,
            net_income=round(net_inc * g),
            operating_income=round(ebitda * g),
        )
        for p, g in zip(periods, growth_rates)
    ]

    income = IncomeStatementData(
        revenue_trend=rev_trends,
        profitability_trend=prof_trends,
        current_revenue=rev,
        current_net_income=net_inc,
        gross_profit_margin=round((ebitda / max(rev, 1.0)) * 100 + 12.0, 1),
        net_profit_margin=round((net_inc / max(rev, 1.0)) * 100, 1),
    )

    balance = BalanceSheetData(
        total_assets=total_assets,
        total_liabilities=total_debt,
        total_equity=equity,
        current_ratio=float(f_ctx.get("current_ratio") or 1.45),
        debt_to_equity=float(f_ctx.get("debt_to_equity") or 0.85),
    )

    cash_flow = CashFlowStatementData(
        operating_cash_flow=round(ebitda * 0.85),
        investing_cash_flow=round(-ebitda * 0.35),
        financing_cash_flow=round(-ebitda * 0.20),
        free_cash_flow=round(ebitda * 0.50),
    )

    ratios = FinancialRatiosData(
        roe=round((net_inc / max(equity, 1.0)) * 100, 1),
        roa=round((net_inc / max(total_assets, 1.0)) * 100, 1),
        quick_ratio=round(float(f_ctx.get("current_ratio") or 1.45) * 0.8, 2),
        interest_coverage=float(f_ctx.get("interest_coverage") or 4.5),
    )

    corporate = CorporateFinancialInput(
        income_statement=income,
        balance_sheet=balance,
        cash_flow_statement=cash_flow,
        financial_ratios=ratios,
    )

    macro_detail = MacroIndustryDetail(
        gdp_growth=2.4,
        inflation_rate=2.8,
        interest_rate=4.75,
        treasury_rate=4.25,
        currency_stability=88.5,
        industry_growth_rate=7.8,
        market_sentiment="Cautiously Optimistic",
        competition_level="Moderate",
        country_risk={
            "rating": "AAA",
            "score": 88,
            "outlook": "Stable",
            "description": "Strong sovereign institutional framework with investment grade rating.",
        },
        historical_trends=[
            {"year": "2022", "gdp": 2.1, "inflation": 6.5, "interest": 3.25, "treasury": 3.85},
            {"year": "2023", "gdp": 2.5, "inflation": 4.1, "interest": 5.0, "treasury": 4.50},
            {"year": "2024", "gdp": 2.8, "inflation": 3.2, "interest": 5.25, "treasury": 4.40},
            {"year": "2025", "gdp": 2.6, "inflation": 2.9, "interest": 4.75, "treasury": 4.25},
            {"year": "2026 (F)", "gdp": 2.4, "inflation": 2.8, "interest": 4.50, "treasury": 4.15},
        ],
        industry_segments=[
            {"segment": f_ctx.get("sector") or "Core Operations", "growth_rate": 8.2},
            {"segment": "Ancillary & Services", "growth_rate": 6.5},
            {"segment": "Digital Transformation", "growth_rate": 14.1},
        ],
    )

    macro = MacroIndustryInput(macro_industry_data=macro_detail)

    resp = ForecastResponse(corporate=corporate, macro=macro)
    return build_success_response(resp.model_dump())
