"""analytics.py – router for analytics placeholder endpoint"""

from fastapi import APIRouter, Depends
from ..models import AnalyticsData
from ..auth import get_current_user

router = APIRouter()

@router.get("/", response_model=AnalyticsData, dependencies=[Depends(get_current_user)])
async def get_analytics():
    """Return analytics placeholder data. Replace with real analytics payload."""
    return AnalyticsData()
