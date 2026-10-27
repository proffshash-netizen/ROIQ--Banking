from typing import Annotated

from fastapi import APIRouter, Depends

from ..dependencies import get_auth_service, get_current_user
from ....core.responses import build_error_response, build_success_response
from ....schemas.auth import LoginRequest, UserContext
from ....services.auth_service import AuthService

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=dict, summary="Authenticate a user")
async def login(
    payload: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> dict:
    try:
        token = auth_service.authenticate(payload.username, payload.password)
        return build_success_response(token.model_dump())
    except Exception as exc:
        return build_error_response("authentication_error", str(exc))


@router.get("/me", response_model=dict, summary="Get current user identity")
async def me(
    current_user: Annotated[UserContext, Depends(get_current_user)],
) -> dict:
    return build_success_response(current_user.model_dump())
