from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ...core.auth import decode_token
from ...core.exceptions import AuthenticationError
from ...interfaces.ai_analysis_service import AIAnalysisService
from ...interfaces.financial_data_service import FinancialDataService
from ...schemas.auth import UserContext
from ...services.analysis_service import AnalysisService
from ...services.auth_service import AuthService
from ...services.health_service import HealthService

security_bearer = HTTPBearer()


class PlaceholderFinancialDataService(FinancialDataService):
    """Temporary placeholder implementation.

    TODO: Implemented by Backend Developer 1
    """

    async def get_company(self, company_id: str) -> dict[str, object]:
        return {"id": company_id, "name": f"Placeholder Company ({company_id})"}

    async def get_financial_statements(
        self, company_id: str
    ) -> list[dict[str, object]]:
        return [{"company_id": company_id, "statement": "placeholder statement"}]

    async def get_market_data(self, symbol: str) -> dict[str, object]:
        return {"symbol": symbol, "price": 150.0}

    async def get_macro_data(self) -> dict[str, object]:
        return {"economy_status": "stable"}


class PlaceholderAIAnalysisService(AIAnalysisService):
    """Temporary placeholder implementation.

    TODO: Implemented by Backend Developer 2
    """

    async def analyze_company(
        self, company_id: str, context: dict[str, object] | None = None
    ) -> dict[str, object]:
        return {"company_id": company_id, "summary": "placeholder AI analysis summary"}

    async def calculate_risk(
        self, company_id: str, context: dict[str, object] | None = None
    ) -> dict[str, object]:
        return {"company_id": company_id, "risk_score": 0.42}

    async def due_diligence(
        self, company_id: str, context: dict[str, object] | None = None
    ) -> dict[str, object]:
        return {"company_id": company_id, "status": "approved"}

    async def explainability(
        self, company_id: str, context: dict[str, object] | None = None
    ) -> dict[str, object]:
        return {"company_id": company_id, "explanation": "placeholder explanation"}


def get_financial_data_service() -> FinancialDataService:
    return PlaceholderFinancialDataService()


def get_ai_analysis_service() -> AIAnalysisService:
    return PlaceholderAIAnalysisService()


def get_auth_service() -> AuthService:
    return AuthService()


def get_health_service() -> HealthService:
    return HealthService()



def get_analysis_service(
    financial_data_service: Annotated[
        FinancialDataService, Depends(get_financial_data_service)
    ],
    ai_analysis_service: Annotated[
        AIAnalysisService, Depends(get_ai_analysis_service)
    ],
) -> AnalysisService:
    return AnalysisService(financial_data_service, ai_analysis_service)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_bearer),
) -> UserContext:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization credentials",
        )
    try:
        user = decode_token(credentials.credentials)
        return user
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=exc.message,
            headers={"WWW-Authenticate": "Bearer"},
        )


class RequireRole:
    def __init__(self, allowed_roles: list[str]) -> None:
        self.allowed_roles = set(allowed_roles)

    def __call__(
        self, current_user: UserContext = Depends(get_current_user)
    ) -> UserContext:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: role '{current_user.role}' lacks sufficient privileges. Required: {list(self.allowed_roles)}",
            )
        return current_user
