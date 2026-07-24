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

router = APIRouter(
    tags=["Dashboard"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer"]))],
)


@router.get(
    "/overview", response_model=dict, summary="Get dashboard overview contract"
)
async def dashboard_overview() -> dict:
    payload = DashboardResponse(
        overview=[
            DashboardKpi(name="Active Deals", value=24, trend="+8%"),
            DashboardKpi(name="AUM ($M)", value=1250.5, trend="+12%"),
            DashboardKpi(name="Risk Alert Ratio", value=0.15, trend="-3%"),
        ],
        widgets=[
            DashboardWidget(
                title="Venture Funding Trends",
                type="chart",
                config=EChartsOption(
                    title={"text": "Quarterly Inflow"},
                    x_axis=EChartsXAxis(
                        data=["2026 Q1", "2026 Q2", "2026 Q3", "2026 Q4"]
                    ),
                    series=[
                        EChartsSeries(
                            name="Seed Stage", type="bar", data=[12.5, 14.8, 11.2, 18.0]
                        ),
                        EChartsSeries(
                            name="Series A/B",
                            type="line",
                            data=[45.0, 52.3, 49.8, 63.1],
                        ),
                    ],
                ),
            )
        ],
    )
    return build_success_response(payload.model_dump(by_alias=True))
