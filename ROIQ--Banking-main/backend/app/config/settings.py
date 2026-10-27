import os
from dataclasses import dataclass


@dataclass(slots=True)
class Settings:
    """Application configuration loaded from environment variables."""

    app_name: str = os.getenv("APP_NAME", "ROIQ AI Backend")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-me-roiq-banking-platform-32bytes")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    cors_origins: tuple[str, ...] = tuple(
        os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000").split(",")
    )
    jwt_access_token_expire_minutes: int = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "480")
    )
    database_url: str | None = os.getenv("DATABASE_URL")
    groq_api_key: str | None = os.getenv("GROQ_API_KEY")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    fred_api_key: str | None = os.getenv("FRED_API_KEY")
    fmp_api_key: str | None = os.getenv("FMP_API_KEY")
    finnhub_api_key: str | None = os.getenv("FINNHUB_API_KEY")
    alpha_vantage_api_key: str | None = os.getenv("ALPHA_VANTAGE_API_KEY")


settings = Settings()
