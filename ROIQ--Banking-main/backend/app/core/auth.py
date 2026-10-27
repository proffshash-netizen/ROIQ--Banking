from datetime import datetime, timedelta, timezone
import jwt

from ..config.settings import settings
from ..schemas.auth import UserContext
from .exceptions import AuthenticationError


def create_access_token(username: str, role: str, expires_delta: timedelta | None = None) -> str:
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.jwt_access_token_expire_minutes)

    payload = {
        "sub": username,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> UserContext:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        username = payload.get("sub")
        role = payload.get("role")
        if not username or not role:
            raise AuthenticationError("Token payload is incomplete")
        return UserContext(username=username, role=role)
    except jwt.PyJWTError as exc:
        raise AuthenticationError("Invalid token") from exc
