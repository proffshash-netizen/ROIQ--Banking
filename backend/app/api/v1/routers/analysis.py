from typing import Annotated

from fastapi import APIRouter, Depends

from ..dependencies import RequireRole, get_analysis_service
from ....core.responses import build_success_response
from ....schemas.analysis import AnalysisRequest
from ....services.analysis_service import AnalysisService

# Analysis actions are reserved for Admin and Analyst roles
router = APIRouter(
    tags=["Analysis"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Corporate Credit Officer"]))],
)


@router.post(
    "/company", response_model=dict, summary="Submit a company analysis request"
)
async def analyze_company(
    payload: AnalysisRequest,
    analysis_service: Annotated[AnalysisService, Depends(get_analysis_service)],
) -> dict:
    result = await analysis_service.analyze_company(payload)
    return build_success_response(result.model_dump())
