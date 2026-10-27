from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....core.synthetic_dataset import SYNTHETIC_DATA_LABEL
from ....schemas.dashboard import (
    DashboardKpi,
    DashboardResponse,
    DashboardWidget,
    EChartsOption,
    EChartsSeries,
    EChartsXAxis,
)
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Dashboard"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get(
    "/overview", response_model=dict, summary="Get dashboard overview contract"
)
async def dashboard_overview() -> dict:
    companies = company_service.list_companies()
    total_eval = len(companies)
    high_critical = [c for c in companies if c.risk_level.lower() in ("high", "critical")]

    # Calculate portfolio total in ₹ Lakh
    total_exposure_lakh = 0.0
    for c in companies:
        exp_str = str(c.loan_exposure).replace("₹", "").replace("$", "").strip()
        if "lakh" in exp_str.lower():
            total_exposure_lakh += float("".join(ch for ch in exp_str if ch.isdigit() or ch == "."))
        elif "cr" in exp_str.lower():
            total_exposure_lakh += float("".join(ch for ch in exp_str if ch.isdigit() or ch == ".")) * 100.0
        elif "b" in exp_str.lower():
            total_exposure_lakh += float("".join(ch for ch in exp_str if ch.isdigit() or ch == ".")) * 100.0
        elif "m" in exp_str.lower():
            total_exposure_lakh += float("".join(ch for ch in exp_str if ch.isdigit() or ch == ".")) * 10.0
        else:
            try:
                total_exposure_lakh += float("".join(ch for ch in exp_str if ch.isdigit() or ch == "."))
            except ValueError:
                total_exposure_lakh += 450.0

    payload = DashboardResponse(
        overview=[
            DashboardKpi(name="Active Corporate Facilities", value=total_eval, trend="+4%"),
            DashboardKpi(name="Total Portfolio (₹ lakh)", value=round(total_exposure_lakh, 1), trend="+11.4%"),
            DashboardKpi(name="Risk Alert Ratio", value=round(len(high_critical) / max(total_eval, 1), 2), trend="-2%"),
        ],
        widgets=[
            DashboardWidget(
                title="Corporate Credit Inflow Trends (₹ lakh)",
                type="chart",
                config=EChartsOption(
                    title={"text": "Quarterly Facility Disbursements (₹ lakh)"},
                    x_axis=EChartsXAxis(
                        data=["2025 Q3", "2025 Q4", "2026 Q1", "2026 Q2"]
                    ),
                    series=[
                        EChartsSeries(
                            name="Working Capital (₹ lakh)", type="bar", data=[320.0, 410.0, 380.0, 480.0]
                        ),
                        EChartsSeries(
                            name="Term Facilities (₹ lakh)",
                            type="line",
                            data=[650.0, 720.0, 810.0, 950.0],
                        ),
                    ],
                ),
            )
        ],
    )
    return build_success_response(payload.model_dump(by_alias=True))


@router.get("/kpis", response_model=dict, summary="Get dashboard KPIs")
async def dashboard_kpis() -> dict:
    companies = company_service.list_companies()
    total_eval = len(companies)
    high_critical = [c for c in companies if c.risk_level.lower() in ("high", "critical")]

    # Express total in ₹ Lakh
    total_exposure_lakh = sum(
        float("".join(ch for ch in str(c.loan_exposure) if ch.isdigit() or ch == ".")) * (100.0 if "cr" in str(c.loan_exposure).lower() else 1.0)
        for c in companies
    )

    return build_success_response({
        "companiesEvaluated": total_eval,
        "totalLoanValue": round(total_exposure_lakh, 2),
        "currency": "INR",
        "unit": "lakh",
        "highRiskFlags": len(high_critical),
        "reportsGenerated": total_eval,
        "datasetsUploaded": 4,
        "loanApprovals": total_eval - len(high_critical),
        "loanRejections": len(high_critical),
        "executiveReports": total_eval,
        "analysisCompleted": total_eval,
        "backendStatus": "operational",
        "disclaimer": SYNTHETIC_DATA_LABEL,
    })


@router.get("/{company_id}", response_model=dict, summary="Get company dashboard summary and KPIs")
async def get_company_dashboard(company_id: str) -> dict:
    companies = company_service.list_companies()
    total_eval = len(companies)
    high_critical = [c for c in companies if c.risk_level.lower() in ("high", "critical")]
    target = next((c for c in companies if str(c.id) == str(company_id)), None)

    return build_success_response({
        "company_id": company_id,
        "company_name": target.name if target else f"Company {company_id}",
        "status": "active",
        "disclaimer": SYNTHETIC_DATA_LABEL,
        "kpis": {
            "companiesEvaluated": total_eval,
            "totalLoanValue": 450.0,  # ₹450 lakh
            "currency": "INR",
            "unit": "lakh",
            "highRiskFlags": len(high_critical),
            "reportsGenerated": total_eval,
            "datasetsUploaded": 4,
            "loanApprovals": total_eval - len(high_critical),
            "loanRejections": len(high_critical),
            "executiveReports": total_eval,
            "analysisCompleted": total_eval,
            "backendStatus": "operational",
        },
    })
