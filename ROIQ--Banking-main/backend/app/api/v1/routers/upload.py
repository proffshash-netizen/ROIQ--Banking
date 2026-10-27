from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from ..dependencies import get_current_user
from ....core.responses import build_error_response, build_success_response
from ....schemas.auth import UserContext
from ....services.ingestion_service import IngestionService

router = APIRouter(tags=["Upload"])

ingestion_service = IngestionService()


@router.post("/dataset", response_model=dict, summary="Upload and ingest financial dataset")
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: Optional[UserContext] = Depends(get_current_user),
) -> dict:
    try:
        content = await file.read()
        user_id = current_user.username if current_user else "anonymous"
        result = ingestion_service.process_upload(
            filename=file.filename or "dataset.csv",
            content=content,
            content_type=file.content_type,
            user_id=user_id,
        )
        return build_success_response(result)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion failed: {str(exc)}",
        )
