from pydantic import BaseModel, ConfigDict, Field


class DashboardKpi(BaseModel):
    name: str
    value: float | int
    trend: str | None = None


class EChartsTooltip(BaseModel):
    trigger: str = "axis"


class EChartsXAxis(BaseModel):
    type: str = "category"
    data: list[str]


class EChartsYAxis(BaseModel):
    type: str = "value"


class EChartsSeries(BaseModel):
    name: str
    type: str = "line"
    data: list[float | int]


class EChartsOption(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: dict[str, str] | None = None
    tooltip: EChartsTooltip = Field(default_factory=EChartsTooltip)
    legend: dict[str, list[str]] | None = None
    x_axis: EChartsXAxis = Field(..., serialization_alias="xAxis")
    y_axis: EChartsYAxis = Field(
        default_factory=EChartsYAxis, serialization_alias="yAxis"
    )
    series: list[EChartsSeries]


class DashboardWidget(BaseModel):
    title: str
    type: str = Field(default="chart")
    config: EChartsOption


class DashboardResponse(BaseModel):
    overview: list[DashboardKpi]
    widgets: list[DashboardWidget]
