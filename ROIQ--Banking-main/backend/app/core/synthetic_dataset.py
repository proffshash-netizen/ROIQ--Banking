"""ROIQ Banking Platform - Centralized Coherent Synthetic Indian Company Dataset.

All financial figures are normalized in ₹ LAKH (1 Lakh = ₹100,000 INR).
Provides single source of truth for dashboard, company profile, credit-risk, treasury,
liquidity, forecasting, and executive reports.

Explicit synthetic values as per institutional banking benchmarks:
- Annual revenue: ₹3,200 lakh
- EBITDA: ₹480 lakh (EBITDA margin = 15.0%)
- Net profit: ₹240 lakh (Net profit margin = 7.5%)
- Cash and cash equivalents: ₹450 lakh
- Current assets: ₹1,200 lakh
- Current liabilities: ₹600 lakh (Current ratio = 2.0x)
- Total assets: ₹8,500 lakh
- Total debt: ₹1,500 lakh
- Shareholders' equity: ₹2,000 lakh (Debt-to-equity = 0.75x)
- Annual interest expense: ₹120 lakh (EBITDA interest coverage = 4.0x)
- Annual operating cash flow: ₹360 lakh

Monthly Treasury Scenario:
- Opening cash balance: ₹450 lakh
- Monthly cash inflows: ₹180 lakh
- Monthly cash outflows: ₹150 lakh
- Net monthly cash flow: ₹30 lakh (Inflows - Outflows)
- Closing cash balance: ₹480 lakh (Opening + Net cash flow)
- Cash coverage: 3.0 months (450 / 150)
"""

from typing import Any, Dict

# Disclaimer label required for all synthetic demo workflows
SYNTHETIC_DATA_LABEL = "DEMO DATA — Synthetic financial figures for demonstration only."

SYNTHETIC_INDIAN_COMPANY: Dict[str, Any] = {
    "company_id": "1",
    "symbol": "TATASTEEL",
    "name": "Tata Steel Ltd. (Demo SME/Corporate Benchmark)",
    "sector": "Metals & Mining",
    "country": "India",
    "currency": "INR",
    "unit": "lakh",
    "is_synthetic": True,
    "disclaimer": SYNTHETIC_DATA_LABEL,
    # Core Financial Figures in ₹ Lakh
    "annual_revenue": 3200.0,
    "ebitda": 480.0,
    "net_profit": 240.0,
    "cash_and_equivalents": 450.0,
    "current_assets": 1200.0,
    "current_liabilities": 600.0,
    "total_assets": 8500.0,
    "total_debt": 1500.0,
    "shareholders_equity": 2000.0,
    "annual_interest_expense": 120.0,
    "annual_operating_cash_flow": 360.0,
    "requested_loan": 450.0,  # ₹450 lakh loan request
    # Derived Ratios
    "ebitda_margin_pct": 15.0,  # 480 / 3200 * 100 = 15.0%
    "net_profit_margin_pct": 7.5,  # 240 / 3200 * 100 = 7.5%
    "current_ratio": 2.0,  # 1200 / 600 = 2.0x
    "debt_to_equity": 0.75,  # 1500 / 2000 = 0.75x
    "ebitda_interest_coverage": 4.0,  # 480 / 120 = 4.0x
    "debt_to_ebitda": 3.125,  # 1500 / 480 = 3.125x
    "dscr": 2.0,  # 360 / (120 + 60 principal amortization) approx 2.0x
    # Treasury Monthly Run-rate in ₹ Lakh
    "treasury": {
        "opening_cash": 450.0,
        "monthly_inflows": 180.0,
        "monthly_outflows": 150.0,
        "net_monthly_cash_flow": 30.0,  # 180 - 150
        "closing_cash": 480.0,  # 450 + 30
        "cash_coverage_months": 3.0,  # 450 / 150 = 3.0 months
        "government_bonds": 240.0,
        "corporate_bonds": 150.0,
        "treasury_bills": 60.0,
        "total_treasury_portfolio": 450.0,  # 240 + 150 + 60
        "average_yield_pct": 6.85,
    },
    # Liquidity Breakdown in ₹ Lakh
    "liquidity": {
        "total_cash": 450.0,
        "operating_cash": 220.0,
        "reserve_cash": 150.0,
        "investment_cash": 80.0,
        "total_liquid_assets": 600.0,
        "short_term_debt": 300.0,
        "long_term_debt": 1200.0,
        "total_debt": 1500.0,
        "total_funding": 2500.0,
        "stable_funding": 2000.0,
        "cash_coverage_months": 3.0,
    },
}


def calculate_financial_ratios(data: Dict[str, float]) -> Dict[str, float]:
    """Calculate and validate financial ratios safely handling zero/missing divisions."""
    rev = max(float(data.get("annual_revenue") or data.get("revenue") or 0.0), 0.0)
    ebitda = float(data.get("ebitda") or 0.0)
    net_profit = float(data.get("net_profit") or data.get("net_income") or 0.0)
    ca = max(float(data.get("current_assets") or 0.0), 0.0)
    cl = max(float(data.get("current_liabilities") or 0.0), 0.0)
    total_debt = max(float(data.get("total_debt") or 0.0), 0.0)
    equity = max(float(data.get("shareholders_equity") or data.get("equity") or 0.0), 0.0)
    interest = max(float(data.get("annual_interest_expense") or data.get("interest_expense") or 0.0), 0.0)
    ocf = float(data.get("annual_operating_cash_flow") or data.get("operating_cash_flow") or 0.0)

    ebitda_margin = round((ebitda / rev) * 100, 2) if rev > 0 else 0.0
    net_margin = round((net_profit / rev) * 100, 2) if rev > 0 else 0.0
    current_ratio = round(ca / cl, 2) if cl > 0 else 0.0
    debt_to_equity = round(total_debt / equity, 2) if equity > 0 else 0.0
    ebitda_interest_cov = round(ebitda / interest, 2) if interest > 0 else 0.0
    debt_to_ebitda = round(total_debt / ebitda, 2) if ebitda > 0 else 0.0

    return {
        "ebitda_margin_pct": ebitda_margin,
        "net_profit_margin_pct": net_margin,
        "current_ratio": current_ratio,
        "debt_to_equity": debt_to_equity,
        "ebitda_interest_coverage": ebitda_interest_cov,
        "debt_to_ebitda": debt_to_ebitda,
        "operating_cash_flow": ocf,
    }


def calculate_treasury_metrics(
    opening_cash: float,
    inflows: float,
    outflows: float,
) -> Dict[str, float]:
    """Calculates deterministic treasury cash-flow metrics in ₹ Lakh.
    Distinguishes opening cash coverage from closing cash coverage.
    """
    net_cf = inflows - outflows
    closing = opening_cash + net_cf
    opening_coverage = round(opening_cash / outflows, 2) if outflows > 0 else 0.0
    closing_coverage = round(closing / outflows, 2) if outflows > 0 else 0.0
    return {
        "opening_cash": round(opening_cash, 2),
        "monthly_inflows": round(inflows, 2),
        "monthly_outflows": round(outflows, 2),
        "net_monthly_cash_flow": round(net_cf, 2),
        "closing_cash": round(closing, 2),
        "cash_coverage_months": opening_coverage,  # Backward compatible key
        "opening_cash_coverage_months": opening_coverage,
        "closing_cash_coverage_months": closing_coverage,
    }


def calculate_liquidity_ratios(
    hqla: float,
    net_30d_cash_outflows: float,
    available_stable_funding: float,
    required_stable_funding: float,
) -> Dict[str, Any]:
    """Calculates LCR and NSFR with transparent data provenance.
    LCR = HQLA / Total net cash outflows over 30 days * 100
    NSFR = Available Stable Funding (ASF) / Required Stable Funding (RSF) * 100
    """
    lcr = round((hqla / net_30d_cash_outflows) * 100, 2) if net_30d_cash_outflows > 0 else None
    nsfr = round((available_stable_funding / required_stable_funding) * 100, 2) if required_stable_funding > 0 else None
    return {
        "lcr": lcr,
        "nsfr": nsfr,
        "hqla_amount": hqla,
        "net_30d_cash_outflows": net_30d_cash_outflows,
        "available_stable_funding": available_stable_funding,
        "required_stable_funding": required_stable_funding,
        "disclaimer": "Illustrative demonstration metrics based on synthetic balance sheet assumptions.",
    }
