"""
Application Configuration

Central configuration management using Pydantic Settings.
Reads from environment variables and .env file.
Supports multiple environments (development, staging, production).
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with production-ready defaults.
    Override any setting via environment variables or .env file.
    """

    # ── Project Info ────────────────────────────────
    PROJECT_NAME: str = "Smart Grid Load Balancing API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "Backend API for Smart Grid Load Balancing & Forecasting"

    # ── Environment ─────────────────────────────────
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # ── Database ────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./smartgrid.db"

    # ── Authentication ──────────────────────────────
    SECRET_KEY: str = "your_super_secret_key_change_this_in_production"
    JWT_SECRET: str = ""  # Can override SECRET_KEY specifically for JWT
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ── Password Policy ─────────────────────────────
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = False
    PASSWORD_REQUIRE_LOWERCASE: bool = False
    PASSWORD_REQUIRE_DIGIT: bool = False
    PASSWORD_REQUIRE_SPECIAL: bool = False

    # ── Rate Limiting ───────────────────────────────
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    LOGIN_RATE_LIMIT_REQUESTS: int = 5
    LOGIN_RATE_LIMIT_WINDOW_MINUTES: int = 15

    # ── Brute Force Protection ──────────────────────
    MAX_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCKOUT_MINUTES: int = 15

    # ── CORS ────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

    # ── Monitoring & Performance ────────────────────
    SLOW_REQUEST_THRESHOLD_MS: int = 1000
    LOG_LEVEL: str = "INFO"
    ENABLE_METRICS: bool = True
    ENABLE_REQUEST_LOGGING: bool = True

    # ── Prometheus Metrics ──────────────────────────
    ENABLE_PROMETHEUS: bool = True
    PROMETHEUS_PORT: int = 9090

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @property
    def jwt_secret(self) -> str:
        """Use JWT_SECRET if set, otherwise fall back to SECRET_KEY."""
        return self.JWT_SECRET or self.SECRET_KEY


settings = Settings()
