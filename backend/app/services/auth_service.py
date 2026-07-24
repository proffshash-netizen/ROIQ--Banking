from datetime import datetime, timedelta, timezone

from ..core.auth import create_access_token, decode_token
from ..core.exceptions import AuthenticationError, AuthorizationError
from ..schemas.auth import TokenResponse, UserContext


class AuthService:
    """Authentication and token handling orchestration service.

    TODO: Implemented by Backend Platform Engineer.
    """

    def authenticate(self, username: str, password: str) -> TokenResponse:
        # Standard mock logins for sandbox evaluation
        mock_users = {
            "admin": "Admin",
            "analyst": "Analyst",
            "viewer": "Viewer",
        }
        if username not in mock_users or password != "password":
            raise AuthenticationError("Invalid username or password")

        role = mock_users[username]
        access_token = create_access_token(username=username, role=role)
        return TokenResponse(access_token=access_token, role=role)

    def get_current_user(self, token: str) -> UserContext:
        return decode_token(token)

    def require_role(self, user: UserContext, allowed_roles: set[str]) -> None:
        if user.role not in allowed_roles:
            raise AuthorizationError(
                f"Role '{user.role}' does not have permission. Required: {list(allowed_roles)}"
            )
