from pydantic import BaseModel, EmailStr, Field


from typing import Any, Optional


class LoginRequest(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: Optional[dict[str, Any]] = None


class UserContext(BaseModel):
    username: str
    role: str
