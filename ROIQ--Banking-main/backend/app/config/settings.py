import os
from dataclasses import dataclass


@dataclass(slots=True)
class Settings:
    """Application configuration loaded from environment variables."""

    app_name: str = os.getenv("APP_NAME", "ROIQ AI Backend")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    # Environment mode: development, test, or production
    environment: str = os.getenv("ENVIRONMENT", "development").lower()

    # JWT configuration
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    cors_origins: tuple[str, ...] = tuple(
        os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000",
        ).split(",")
    )
    jwt_access_token_expire_minutes: int = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "480")
    )

    # Demo mode: Explicitly isolated demo authentication mode
    demo_mode: bool = os.getenv("DEMO_MODE", "true").lower() == "true"

    # Database and external integrations
    database_url: str | None = os.getenv("DATABASE_URL")
    groq_api_key: str | None = os.getenv("GROQ_API_KEY")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    fred_api_key: str | None = os.getenv("FRED_API_KEY")
    fmp_api_key: str | None = os.getenv("FMP_API_KEY")
    finnhub_api_key: str | None = os.getenv("FINNHUB_API_KEY")
    alpha_vantage_api_key: str | None = os.getenv("ALPHA_VANTAGE_API_KEY")

    # Ingestion constraints
    max_upload_size_bytes: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(10 * 1024 * 1024)))  # 10 MB default

    def validate_security(self) -> None:
        """Validate security settings at startup.
        
        In production, missing or insecure default secret keys fail immediately.
        In test/dev environments, a deterministic fallback key is permitted if not provided.
        """
        insecure_keys = {
            "",
            "dev-secret-key-change-me-roiq-banking-platform-32bytes",
            "secret",
            "changeme",
            "replace-with-secure-32-byte-secret-key-for-production",
        }
        if self.environment == "production":
            if not self.jwt_secret_key or self.jwt_secret_key in insecure_keys or len(self.jwt_secret_key) < 32:
                raise ValueError(
                    "FATAL SECURITY CONFIGURATION: Production requires a secure JWT_SECRET_KEY "
                    "with minimum 32 characters loaded from environment variables."
                )
        else:
            # Development/testing fallback if secret key is missing or default
            if not self.jwt_secret_key:
                self.jwt_secret_key = "roiq-dev-authorized-key-32bytes-secure-hash"


settings = Settings()
settings.validate_security()
