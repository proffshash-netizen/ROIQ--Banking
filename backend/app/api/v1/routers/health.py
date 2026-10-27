from typing import Annotated

from fastapi import APIRouter, Depends

from ..dependencies import get_health_service
from ....core.responses import build_health_response
from ....services.health_service import HealthService

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Application health")
async def health(
    health_service: Annotated[HealthService, Depends(get_health_service)]
) -> dict:
    status_info = await health_service.get_health_status()
    return build_health_response(status_info["status"], status_info["service"])


@router.get("/ready", summary="Readiness probe")
async def ready(
    health_service: Annotated[HealthService, Depends(get_health_service)]
) -> dict:
    status_info = await health_service.get_readiness_status()
    return build_health_response(status_info["status"], status_info["service"])


@router.get("/live", summary="Liveness probe")
async def live(
    health_service: Annotated[HealthService, Depends(get_health_service)]
) -> dict:
    status_info = await health_service.get_liveness_status()
    return build_health_response(status_info["status"], status_info["service"])
