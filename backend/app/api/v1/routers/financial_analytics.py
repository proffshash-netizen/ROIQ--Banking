from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.financial_analytics import (
    FinancialAnalyticsOutput,
    LiquidityInput,
    TreasuryInput,
)
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Financial Analytics"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get("/{company_id}", response_model=dict, summary="Get company treasury and liquidity analytics")
async def get_financial_analytics(company_id: str) -> dict:
    f_ctx = company_service.get_financial_context(company_id)
    company_name = f_ctx.get("name") or f"Company {company_id}"
    score = f_ctx.get("credit_score") or 72
    rev = f_ctx.get("revenue") or 1_000_000_000.0
    total_debt = f_ctx.get("total_debt") or 400_000_000.0

    # Scale treasury and liquidity figures to corporate size
    cash = round(rev * 0.18)
    liquid_assets = round(cash * 1.95)
    total_funding = round(total_debt * 1.25)
    gov_bonds = round(cash * 0.55)
    corp_bonds = round(cash * 0.45)
    now_iso = datetime.now(timezone.utc).isoformat()

    treasury = TreasuryInput(
        bond_portfolio={
            "total_value": gov_bonds + corp_bonds,
            "government_bonds": gov_bonds,
            "corporate_bonds": corp_bonds,
            "risk_rating": "AA" if score >= 80 else "A" if score >= 65 else "BBB",
        },
        treasury_securities={
            "t_bills": round(cash * 0.25),
            "t_notes": round(cash * 0.40),
            "t_bonds": round(cash * 0.35),
            "yield_to_maturity": 4.85,
        },
        interest_rate_information={
            "benchmark_rate": 4.75,
            "effective_rate": round(4.75 + (100 - score) * 0.035, 2),
            "sensitivity": "Low" if score >= 75 else "Medium",
        },
        yield_curve_data={
            "1M": 4.95,
            "3M": 4.90,
            "6M": 4.82,
            "1Y": 4.65,
            "2Y": 4.45,
            "5Y": 4.30,
            "10Y": 4.25,
            "30Y": 4.35,
        },
        duration_information={
            "macaulay_duration": 4.2,
            "modified_duration": 3.9,
            "convexity": 0.85,
        },
        ai_treasury_assessment=f"Active treasury positioning for {company_name} maintains high liquidity reserves with duration matched to liabilities.",
        last_updated=now_iso,
    )

    liquidity = LiquidityInput(
        cash_positions={
            "total_cash": cash,
            "operating_cash": round(cash * 0.40),
            "reserve_cash": round(cash * 0.30),
            "investment_cash": round(cash * 0.20),
            "restricted_cash": round(cash * 0.10),
            "currency_breakdown": {
                "INR": round(cash * 0.65),
                "USD": round(cash * 0.25),
                "EUR": round(cash * 0.10),
            },
        },
        liquid_assets={
            "total_liquid_assets": liquid_assets,
            "hqla_level_1": round(liquid_assets * 0.60),
            "hqla_level_2a": round(liquid_assets * 0.25),
            "hqla_level_2b": round(liquid_assets * 0.15),
            "unencumbered_assets": round(liquid_assets * 0.90),
            "encumbered_assets": round(liquid_assets * 0.10),
        },
        funding_information={
            "total_funding": total_funding,
            "wholesale_funding": round(total_funding * 0.55),
            "retail_deposits": round(total_funding * 0.45),
        },
        debt_obligations={
            "short_term": round(total_debt * 0.25),
            "long_term": round(total_debt * 0.75),
        },
        liquidity_ratios={
            "lcr": round(145.0 + (score - 60) * 0.8, 1),
            "nsfr": round(118.0 + (score - 60) * 0.5, 1),
            "cash_ratio": round(cash / max(total_debt * 0.25, 1.0), 2),
        },
        last_updated=now_iso,
    )

    output = FinancialAnalyticsOutput(treasury=treasury, liquidity=liquidity)
    return build_success_response(output.model_dump())
