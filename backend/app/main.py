from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.v1.routers import analysis, auth, dashboard, external_data, health, stream, websocket
from .config.settings import settings
from .core.exceptions import PlatformError
from .core.responses import build_error_response
from .middleware.logging_middleware import LoggingMiddleware


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Enterprise backend platform foundation for future AI and data integrations.",
        openapi_tags=[
            {
                "name": "Authentication",
                "description": "Authentication and token handling",
            },
            {"name": "Analysis", "description": "Analysis orchestration contracts"},
            {"name": "Dashboard", "description": "Dashboard response contracts"},
            {"name": "Streaming", "description": "SSE and WebSocket placeholders"},
            {"name": "Health", "description": "Application health and readiness probes"},
        ],
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LoggingMiddleware)

    # Mount routes
    app.include_router(auth.router, prefix="/api/v1/auth")
    app.include_router(analysis.router, prefix="/api/v1/analysis")
    app.include_router(dashboard.router, prefix="/api/v1/dashboard")
    app.include_router(external_data.router, prefix="/api/v1/external-data")
    app.include_router(health.router, prefix="/api/v1/health")
    app.include_router(health.router, prefix="")  # Support root /health, /ready, /live
    app.include_router(websocket.router, prefix="/api/v1/ws")
    app.include_router(stream.router, prefix="/api/v1/stream")

    @app.exception_handler(PlatformError)
    async def platform_exception_handler(
        request: Request, exc: PlatformError
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=400,
            content=build_error_response(
                code=exc.code, message=exc.message, request_id=request_id
            ),
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=500,
            content=build_error_response(
                code="internal_server_error",
                message="An unexpected system error occurred. Please contact the platform engineering team.",
                request_id=request_id,
            ),
        )

    return app


app = create_app()
