"""auth.py – simple JWT authentication utilities"""

import os
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# In a real project, load secret from env
JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60

bearer = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    token = credentials.credentials
    payload = decode_token(token)
    return payload  # In real app, map to User model

# Example login endpoint (stub)
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    # Stub: accept any credentials, return dummy user
    user = {"id": "123", "name": "Demo User", "email": req.email, "role": "Administrator"}
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {"token": token, "user": user}

@router.get("/me", response_model=dict)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
