from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Grid Load Balancing API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = (
        "Backend API for Smart Grid Load Balancing & Forecasting"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()