import os
import uuid
from fastapi import APIRouter, File, UploadFile
from ....core.responses import build_success_response

router = APIRouter(tags=["Upload"])

@router.post("/dataset", response_model=dict, summary="Upload financial dataset")
async def upload_dataset(file: UploadFile = File(...)) -> dict:
    dataset_id = str(uuid.uuid4())
    os.makedirs("uploads", exist_ok=True)
    upload_path = os.path.join("uploads", f"{dataset_id}_{file.filename}")
    content = await file.read()
    with open(upload_path, "wb") as buffer:
        buffer.write(content)
    return build_success_response({
        "status": "uploaded",
        "datasetId": dataset_id,
        "filename": file.filename,
        "sizeBytes": len(content),
    })
