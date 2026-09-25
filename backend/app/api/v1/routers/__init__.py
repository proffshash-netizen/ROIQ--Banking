from .ai_insights import router as ai_insights_router
from .analysis import router as analysis_router
from .auth import router as auth_router
from .companies import router as companies_router
from .credit_risk import router as credit_risk_router
from .dashboard import router as dashboard_router
from .executive_report import router as executive_report_router
from .external_data import router as external_data_router
from .financial_analytics import router as financial_analytics_router
from .forecasts import router as forecasts_router
from .health import router as health_router
from .loan_recommendation import router as loan_recommendation_router
from .stream import router as stream_router
from .upload import router as upload_router
from .websocket import router as websocket_router

__all__ = [
    "ai_insights_router",
    "analysis_router",
    "auth_router",
    "companies_router",
    "credit_risk_router",
    "dashboard_router",
    "executive_report_router",
    "external_data_router",
    "financial_analytics_router",
    "forecasts_router",
    "health_router",
    "loan_recommendation_router",
    "stream_router",
    "upload_router",
    "websocket_router",
]
