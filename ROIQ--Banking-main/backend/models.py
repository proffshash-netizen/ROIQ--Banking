"""models.py – Pydantic data models shared across routers"""

from pydantic import BaseModel
from typing import List, Optional

class DashboardKPIs(BaseModel):
    companiesEvaluated: int = 0
    totalLoanValue: float = 0.0
    highRiskFlags: int = 0
    reportsGenerated: int = 0
    datasetsUploaded: int = 0
    loanApprovals: int = 0
    loanRejections: int = 0
    executiveReports: int = 0
    analysisCompleted: int = 0
    backendStatus: str = "waiting"

class UploadResponse(BaseModel):
    status: str
    datasetId: str

class Company(BaseModel):
    id: str
    name: str
    revenue: Optional[float] = None
    creditScore: Optional[int] = None
    # add more fields as backend evolves

# Placeholder models for future features – keep them empty for now
class AnalyticsData(BaseModel):
    pass

class ForecastData(BaseModel):
    pass

class RiskData(BaseModel):
    pass

class ReportData(BaseModel):
    pass

class InsightsData(BaseModel):
    pass

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
