from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.v1.routers import (
    ai_insights,
    analysis,
    auth,
    companies,
    credit_risk,
    dashboard,
    executive_report,
    external_data,
    financial_analytics,
    forecasts,
    health,
    loan_recommendation,
    stream,
    upload,
    websocket,
)
from .config.settings import settings
from .core.exceptions import PlatformError
from .core.responses import build_error_response
from .middleware.logging_middleware import LoggingMiddleware


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from .db.session import init_db, SessionLocal
        from .db.repositories.company_repository import CompanyRepository
        init_db()
        with SessionLocal() as db:
            CompanyRepository(db).seed_initial_portfolio_if_empty()
    except Exception:
        pass
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Enterprise backend platform foundation for future AI and data integrations.",
        lifespan=lifespan,
        openapi_tags=[
            {"name": "Authentication", "description": "Authentication and token handling"},
            {"name": "Companies", "description": "Corporate portfolio management"},
            {"name": "Credit Risk", "description": "Credit risk underwriting & LangGraph HITL evaluation"},
            {"name": "Financial Analytics", "description": "Treasury and liquidity management"},
            {"name": "Forecasts", "description": "Financial and macroeconomic forward projections"},
            {"name": "Loan Recommendation", "description": "CDSS decision engine and explainability"},
            {"name": "Executive Report", "description": "Comprehensive credit assessment report"},
            {"name": "AI Insights", "description": "Fact, metric, interpretation, and recommendation decomposition"},
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
    app.include_router(companies.router, prefix="/api/v1/companies")

    app.include_router(credit_risk.router, prefix="/api/v1/credit-risk")
    app.include_router(analysis.router, prefix="/api/v1/analysis")
    app.include_router(dashboard.router, prefix="/api/v1/dashboard")
    app.include_router(financial_analytics.router, prefix="/api/v1/financial-analytics")
    app.include_router(forecasts.router, prefix="/api/v1/forecasts")
    app.include_router(loan_recommendation.router, prefix="/api/v1/loan-recommendation")
    app.include_router(executive_report.router, prefix="/api/v1/executive-report")
    app.include_router(ai_insights.router, prefix="/api/v1/ai-insights")
    app.include_router(external_data.router, prefix="/api/v1/external-data")
    app.include_router(upload.router, prefix="/api/v1/upload")
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
