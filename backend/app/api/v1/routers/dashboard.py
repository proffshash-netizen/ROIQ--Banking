from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
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
    
    total_exposure = 0.0
    for c in companies:
        exp_str = c.loan_exposure.replace("$", "").strip()
        if "B" in exp_str:
            total_exposure += float(exp_str.replace("B", "")) * 1000
        elif "M" in exp_str:
            total_exposure += float(exp_str.replace("M", ""))
            
    payload = DashboardResponse(
        overview=[
            DashboardKpi(name="Active Deals", value=total_eval, trend="+4%"),
            DashboardKpi(name="AUM ($M)", value=round(total_exposure, 1), trend="+11.4%"),
            DashboardKpi(name="Risk Alert Ratio", value=round(len(high_critical) / max(total_eval, 1), 2), trend="-2%"),
        ],
        widgets=[
            DashboardWidget(
                title="Corporate Credit Inflow Trends",
                type="chart",
                config=EChartsOption(
                    title={"text": "Quarterly Facility Disbursements ($M)"},
                    x_axis=EChartsXAxis(
                        data=["2025 Q3", "2025 Q4", "2026 Q1", "2026 Q2"]
                    ),
                    series=[
                        EChartsSeries(
                            name="Working Capital", type="bar", data=[320.0, 410.5, 380.2, 540.0]
                        ),
                        EChartsSeries(
                            name="Term Facilities",
                            type="line",
                            data=[650.0, 720.0, 810.5, 950.0],
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
    
    total_exposure_dollars = 0.0
    for c in companies:
        exp_str = c.loan_exposure.replace("$", "").strip()
        if "B" in exp_str:
            total_exposure_dollars += float(exp_str.replace("B", "")) * 1_000_000_000
        elif "M" in exp_str:
            total_exposure_dollars += float(exp_str.replace("M", "")) * 1_000_000

    return build_success_response({
        "companiesEvaluated": total_eval,
        "totalLoanValue": total_exposure_dollars,
        "highRiskFlags": len(high_critical),
        "reportsGenerated": total_eval,
        "datasetsUploaded": 4,
        "loanApprovals": total_eval - len(high_critical),
        "loanRejections": len(high_critical),
        "executiveReports": total_eval,
        "analysisCompleted": total_eval,
        "backendStatus": "operational",
    })


@router.get("/{company_id}", response_model=dict, summary="Get company dashboard summary and KPIs")
async def get_company_dashboard(company_id: str) -> dict:
    companies = company_service.list_companies()
    total_eval = len(companies)
    high_critical = [c for c in companies if c.risk_level.lower() in ("high", "critical")]
    target = next((c for c in companies if c.id == company_id), None)
    
    return build_success_response({
        "company_id": company_id,
        "company_name": target.name if target else f"Company {company_id}",
        "status": "active",
        "kpis": {
            "companiesEvaluated": total_eval,
            "totalLoanValue": 5820000000.0,
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


