from .analysis import router as analysis_router
from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .external_data import router as external_data_router
from .health import router as health_router
from .stream import router as stream_router
from .websocket import router as websocket_router

__all__ = [
    "analysis_router",
    "auth_router",
    "dashboard_router",
    "external_data_router",
    "health_router",
    "stream_router",
    "websocket_router",
]
