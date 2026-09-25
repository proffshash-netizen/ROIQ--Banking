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
            "cco@roiq.ai": "Corporate Credit Officer",
        }
        
        valid = False
        role = "Corporate Credit Officer"
        if username in mock_users:
            if password in ("password", "password123"):
                valid = True
                role = mock_users[username]
        elif password in ("password", "password123") or len(password) >= 6:
            # Allow custom demo logins
            valid = True
            role = "Corporate Credit Officer"

        if not valid:
            raise AuthenticationError("Invalid username or password")

        access_token = create_access_token(username=username, role=role)
        name = "Thomas Shelby" if username == "cco@roiq.ai" else username.split("@")[0].capitalize()
        user_info = {
            "id": f"usr_{abs(hash(username)) % 10000}",
            "name": name,
            "email": username if "@" in username else f"{username}@roiq.ai",
            "role": role,
        }
        return TokenResponse(access_token=access_token, role=role, user=user_info)

    def get_current_user(self, token: str) -> UserContext:
        return decode_token(token)

    def require_role(self, user: UserContext, allowed_roles: set[str]) -> None:
        if user.role not in allowed_roles:
            raise AuthorizationError(
                f"Role '{user.role}' does not have permission. Required: {list(allowed_roles)}"
            )
