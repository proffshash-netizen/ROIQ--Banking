from typing import Annotated

from fastapi import APIRouter, Depends

from ....core.responses import build_success_response
from ....schemas.external_data import ExternalDataRequest, NormalizedDataResponse
from ....services.external_data_pipeline import ExternalDataPipelineService
from ....services.external_provider_service import HttpExternalProviderService

router = APIRouter(tags=["External Data"])


def get_external_data_pipeline_service() -> ExternalDataPipelineService:
    provider = HttpExternalProviderService()
    return ExternalDataPipelineService(provider)


@router.post(
    "/normalize",
    response_model=dict,
    summary="Fetch external financial data and normalize into the AI contract",
)
async def normalize_external_data(
    payload: ExternalDataRequest,
    pipeline_service: Annotated[
        ExternalDataPipelineService,
        Depends(get_external_data_pipeline_service),
    ],
) -> dict:
    response = await pipeline_service.build_normalized_payload(payload)
    return build_success_response(response.model_dump())
