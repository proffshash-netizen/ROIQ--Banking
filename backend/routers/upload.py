"""upload.py – router for dataset upload endpoint"""

from fastapi import APIRouter, File, UploadFile, Depends
from ..models import UploadResponse
from ..auth import get_current_user
import uuid

router = APIRouter()

@router.post("/dataset", response_model=UploadResponse, dependencies=[Depends(get_current_user)])
async def upload_dataset(file: UploadFile = File(...)):
    """Accept a CSV or Excel file and store it temporarily.
    The implementation stores the file under a temporary ``uploads`` directory
    and returns a generated ``datasetId``. Replace the stub with persistent storage
    as needed.
    """
    # Simple temporary storage – adjust for production needs
    dataset_id = str(uuid.uuid4())
    upload_path = f"uploads/{dataset_id}_{file.filename}"
    # Ensure the uploads folder exists
    import os
    os.makedirs("uploads", exist_ok=True)
    with open(upload_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    return UploadResponse(status="uploaded", datasetId=dataset_id)
