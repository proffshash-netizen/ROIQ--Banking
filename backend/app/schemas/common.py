from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class MetaResponse(BaseModel):
    timestamp: datetime
    processing_time_ms: int = Field(default=0, ge=0)


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: MetaResponse


class ErrorDetail(BaseModel):
    code: str
    message: str
    request_id: str | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


class HealthStatus(BaseModel):
    status: str
    service: str
    timestamp: datetime


class ChartSeries(BaseModel):
    name: str
    data: list[float | int]


class EChartsResponse(BaseModel):
    title: str | None = None
    series: list[ChartSeries]
    x_axis: list[str] | None = None
