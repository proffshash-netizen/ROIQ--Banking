from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....core.synthetic_dataset import (
    SYNTHETIC_DATA_LABEL,
    SYNTHETIC_INDIAN_COMPANY,
    calculate_treasury_metrics,
)
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
    company_name = f_ctx.get("name") or SYNTHETIC_INDIAN_COMPANY["name"]
    score = f_ctx.get("credit_score") or 72

    # Derived directly from centralized synthetic dataset in ₹ Lakh
    t_synth = SYNTHETIC_INDIAN_COMPANY["treasury"]
    l_synth = SYNTHETIC_INDIAN_COMPANY["liquidity"]

    # Calculate exact monthly cash flow scenario
    # Opening: ₹450 lakh, Inflows: ₹180 lakh, Outflows: ₹150 lakh, Net: ₹30 lakh, Closing: ₹480 lakh
    # Cash coverage: 450 / 150 = 3.0 months
    treasury_runrate = calculate_treasury_metrics(
        opening_cash=t_synth["opening_cash"],
        inflows=t_synth["monthly_inflows"],
        outflows=t_synth["monthly_outflows"],
    )

    cash = treasury_runrate["opening_cash"]  # 450.0 lakh
    gov_bonds = t_synth["government_bonds"]  # 240.0 lakh
    corp_bonds = t_synth["corporate_bonds"]  # 150.0 lakh
    t_bills = t_synth["treasury_bills"]  # 60.0 lakh
    total_bonds = gov_bonds + corp_bonds + t_bills  # 450.0 lakh
    now_iso = datetime.now(timezone.utc).isoformat()

    treasury = TreasuryInput(
        bond_portfolio={
            "total_value": total_bonds,
            "government_bonds": gov_bonds,
            "corporate_bonds": corp_bonds,
            "risk_rating": "AA" if score >= 80 else "A" if score >= 65 else "BBB",
            "disclaimer": SYNTHETIC_DATA_LABEL,
        },
        treasury_securities={
            "t_bills": t_bills,
            "t_notes": 120.0,
            "t_bonds": 270.0,
            "yield_to_maturity": 6.85,
        },
        interest_rate_information={
            "benchmark_rate": 6.50,  # RBI Repo Rate benchmark
            "effective_rate": 6.85,
            "sensitivity": "Moderate",
        },
        yield_curve_data={
            "3M": 5.85,
            "6M": 6.02,
            "1Y": 6.25,
            "2Y": 6.48,
            "5Y": 6.82,
            "10Y": 7.05,
            "30Y": 7.35,
        },
        duration_information={
            "macaulay_duration": 4.95,
            "modified_duration": 4.65,
            "convexity": 24.2,
        },
        ai_treasury_assessment=(
            f"{SYNTHETIC_DATA_LABEL} Treasury profile for {company_name}: "
            f"Opening cash ₹{treasury_runrate['opening_cash']} lakh, "
            f"Monthly cash inflows ₹{treasury_runrate['monthly_inflows']} lakh, "
            f"Monthly cash outflows ₹{treasury_runrate['monthly_outflows']} lakh, "
            f"Net monthly cash flow ₹{treasury_runrate['net_monthly_cash_flow']} lakh, "
            f"Closing cash ₹{treasury_runrate['closing_cash']} lakh. "
            f"Cash coverage: {treasury_runrate['cash_coverage_months']} months."
        ),
        last_updated=now_iso,
    )

    from ....core.synthetic_dataset import calculate_liquidity_ratios
    # HQLA = 550.0 lakh unencumbered, Net 30-day cash outflows = 386.0 lakh
    # Available Stable Funding = 2000.0 lakh, Required Stable Funding = 1692.0 lakh -> NSFR = 118.2%
    liq_calc = calculate_liquidity_ratios(
        hqla=550.0,
        net_30d_cash_outflows=386.0,
        available_stable_funding=2000.0,
        required_stable_funding=1692.0,
    )

    liquidity = LiquidityInput(
        cash_positions={
            "total_cash": cash,  # 450.0 lakh
            "operating_cash": 220.0,
            "reserve_cash": 150.0,
            "investment_cash": 80.0,
            "restricted_cash": 0.0,
            "currency_breakdown": {
                "INR": 450.0,
            },
        },
        liquid_assets={
            "total_liquid_assets": 600.0,
            "hqla_level_1": 450.0,
            "hqla_level_2a": 100.0,
            "hqla_level_2b": 50.0,
            "unencumbered_assets": 550.0,
            "encumbered_assets": 50.0,
        },
        funding_information={
            "total_funding": l_synth["total_funding"],
            "stable_funding": l_synth["stable_funding"],
            "wholesale_funding": 500.0,
            "retail_deposits": 1500.0,
        },
        debt_obligations={
            "short_term": l_synth["short_term_debt"],  # 300 lakh
            "long_term": l_synth["long_term_debt"],    # 1200 lakh
            "total_debt": l_synth["total_debt"],      # 1500 lakh
        },
        liquidity_ratios={
            "cash_coverage_months": treasury_runrate["cash_coverage_months"],  # 3.0 months (opening)
            "opening_cash_coverage_months": treasury_runrate["opening_cash_coverage_months"],  # 3.0 months
            "closing_cash_coverage_months": treasury_runrate["closing_cash_coverage_months"],  # 3.2 months
            "current_ratio": 2.0,  # 1200 / 600
            "quick_ratio": 1.25,
            "lcr": liq_calc["lcr"],  # 142.49% derived from HQLA / stressed 30d outflows
            "nsfr": liq_calc["nsfr"],  # 118.2% derived from ASF / RSF
            "disclaimer": SYNTHETIC_DATA_LABEL,
        },
        last_updated=now_iso,
    )

    output = FinancialAnalyticsOutput(treasury=treasury, liquidity=liquidity)
    return build_success_response(output.model_dump())
