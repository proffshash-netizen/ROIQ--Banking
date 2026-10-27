from typing import Any
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....core.synthetic_dataset import (
    SYNTHETIC_DATA_LABEL,
    SYNTHETIC_INDIAN_COMPANY,
    calculate_financial_ratios,
)
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
    
    # Financial metrics in ₹ Lakh from centralized synthetic dataset
    rev = SYNTHETIC_INDIAN_COMPANY["annual_revenue"]       # 3200.0 lakh
    ebitda = SYNTHETIC_INDIAN_COMPANY["ebitda"]            # 480.0 lakh
    net_inc = SYNTHETIC_INDIAN_COMPANY["net_profit"]       # 240.0 lakh
    total_assets = SYNTHETIC_INDIAN_COMPANY["total_assets"] # 8500.0 lakh
    total_debt = SYNTHETIC_INDIAN_COMPANY["total_debt"]    # 1500.0 lakh
    equity = SYNTHETIC_INDIAN_COMPANY["shareholders_equity"] # 2000.0 lakh
    curr_assets = SYNTHETIC_INDIAN_COMPANY["current_assets"] # 1200.0 lakh
    curr_liab = SYNTHETIC_INDIAN_COMPANY["current_liabilities"] # 600.0 lakh

    # Growth trajectory: 2022 to 2026(F) in ₹ Lakh
    growth_rates = [0.80, 0.88, 0.95, 1.00, 1.08]
    periods = ["2022", "2023", "2024", "2025", "2026 (F)"]

    rev_trends = [
        RevenueTrendPoint(period=p, value=round(rev * g, 1))
        for p, g in zip(periods, growth_rates)
    ]
    prof_trends = [
        ProfitabilityTrendPoint(
            period=p,
            net_income=round(net_inc * g, 1),
            operating_income=round(ebitda * g, 1),
        )
        for p, g in zip(periods, growth_rates)
    ]

    income = IncomeStatementData(
        revenue_trend=rev_trends,
        profitability_trend=prof_trends,
        current_revenue=rev,
        current_net_income=net_inc,
        gross_profit_margin=SYNTHETIC_INDIAN_COMPANY["ebitda_margin_pct"],  # 15.0%
        net_profit_margin=SYNTHETIC_INDIAN_COMPANY["net_profit_margin_pct"],  # 7.5%
    )

    balance = BalanceSheetData(
        total_assets=total_assets,
        total_liabilities=total_debt,
        total_equity=equity,
        current_ratio=SYNTHETIC_INDIAN_COMPANY["current_ratio"],  # 2.0x
        debt_to_equity=SYNTHETIC_INDIAN_COMPANY["debt_to_equity"],  # 0.75x
    )

    cash_flow = CashFlowStatementData(
        operating_cash_flow=SYNTHETIC_INDIAN_COMPANY["annual_operating_cash_flow"],  # 360.0 lakh
        investing_cash_flow=-140.0,
        financing_cash_flow=-90.0,
        free_cash_flow=220.0,
    )

    ratios = FinancialRatiosData(
        roe=round((net_inc / equity) * 100, 2),  # 240 / 2000 = 12.0%
        roa=round((net_inc / total_assets) * 100, 2),  # 240 / 8500 = 2.82%
        quick_ratio=round((curr_assets - 300.0) / curr_liab, 2),  # (1200 - 300)/600 = 1.5x
        interest_coverage=SYNTHETIC_INDIAN_COMPANY["ebitda_interest_coverage"],  # 4.0x
    )

    corporate = CorporateFinancialInput(
        income_statement=income,
        balance_sheet=balance,
        cash_flow_statement=cash_flow,
        financial_ratios=ratios,
    )

    macro_detail = MacroIndustryDetail(
        gdp_growth=6.8,
        inflation_rate=4.8,
        interest_rate=6.50,
        treasury_rate=7.05,
        currency_stability=85.2,
        industry_growth_rate=8.5,
        market_sentiment="Positive",
        competition_level="Moderate",
        country_risk={
            "rating": "BBB-",
            "score": 68,
            "outlook": "Stable",
            "description": f"{SYNTHETIC_DATA_LABEL} Resilient Indian macroeconomic growth outlook.",
        },
        historical_trends=[
            {"year": "2022", "gdp": 7.2, "inflation": 6.7, "interest": 4.90, "treasury": 7.30},
            {"year": "2023", "gdp": 7.0, "inflation": 5.4, "interest": 6.50, "treasury": 7.20},
            {"year": "2024", "gdp": 6.8, "inflation": 4.9, "interest": 6.50, "treasury": 7.10},
            {"year": "2025", "gdp": 6.7, "inflation": 4.6, "interest": 6.25, "treasury": 7.00},
            {"year": "2026 (F)", "gdp": 6.8, "inflation": 4.5, "interest": 6.00, "treasury": 6.90},
        ],
        industry_segments=[
            {"segment": "Domestic Infrastructure", "growth_rate": 9.4},
            {"segment": "Automotive & Industrial Steel", "growth_rate": 8.1},
            {"segment": "Renewable Engineering", "growth_rate": 12.6},
        ],
    )

    macro = MacroIndustryInput(macro_industry_data=macro_detail)

    resp = ForecastResponse(corporate=corporate, macro=macro)
    return build_success_response(resp.model_dump())
