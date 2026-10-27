"""dashboard.py – router for KPI endpoints"""

from fastapi import APIRouter, Depends
from ..models import DashboardKPIs
from ..auth import get_current_user

router = APIRouter()

@router.get("/kpis", response_model=DashboardKPIs, dependencies=[Depends(get_current_user)])
async def get_kpis():
    """Return current dashboard KPI values.
    In the placeholder implementation all numbers are zero and backendStatus is 'waiting'.
    Replace the body with real data sources (database, ML service, etc.).
    """
    return DashboardKPIs()
