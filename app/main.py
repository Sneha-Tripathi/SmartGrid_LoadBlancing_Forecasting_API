from fastapi import FastAPI

from app.api.router import api_router

app = FastAPI(
    title="Smart Grid Load Balancing API",
    version="1.0.0",
    description="Backend API for Smart Grid Load Balancing & Forecasting"
)

app.include_router(api_router)