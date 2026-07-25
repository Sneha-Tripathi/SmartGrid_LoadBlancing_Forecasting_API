from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Grid Load Balancing API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "Backend API for Smart Grid Load Balancing & Forecasting"

    DATABASE_URL: str = "sqlite:///./smartgrid.db"

    SECRET_KEY: str = "your_super_secret_key_change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()