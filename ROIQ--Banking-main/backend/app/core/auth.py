from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt

from ..config.settings import settings
from ..schemas.auth import UserContext
from .exceptions import AuthenticationError


def create_access_token(
    username: str,
    role: str,
    expires_delta: Optional[timedelta] = None,
    secret_key: Optional[str] = None,
) -> str:
    key = secret_key or settings.jwt_secret_key
    if not key:
        raise AuthenticationError("JWT signing secret key is missing from configuration")

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
    return jwt.encode(payload, key, algorithm=settings.jwt_algorithm)


def decode_token(token: str, secret_key: Optional[str] = None) -> UserContext:
    key = secret_key or settings.jwt_secret_key
    if not key:
        raise AuthenticationError("JWT signing secret key is missing from configuration")

    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=[settings.jwt_algorithm],
            options={"require": ["exp", "sub", "role"]},
        )
        username = payload.get("sub")
        role = payload.get("role")
        if not username or not role:
            raise AuthenticationError("Token payload is incomplete")
        return UserContext(username=username, role=role)
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Token has expired") from exc
    except jwt.PyJWTError as exc:
        raise AuthenticationError("Invalid token or signature") from exc
