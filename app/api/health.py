"""
Health & Root API Endpoints

Provides root status and health check endpoints.
Uses application settings for dynamic metadata.
"""

from datetime import UTC, datetime

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import settings

router = APIRouter()


@router.get(
    "/",
    tags=["Root"],
    summary="Root status check",
    description="Returns basic API status with version information.",
    response_description="API status and version",
    status_code=status.HTTP_200_OK,
)
def root():
    """
    Root endpoint returning basic API status.

    Returns:
        JSONResponse with status, message, and version.
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "message": f"{settings.PROJECT_NAME} is Running 🚀",
            "version": settings.PROJECT_VERSION,
        },
    )


@router.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Checks whether the API service is healthy and operational.",
    response_description="Health status with timestamp",
    status_code=status.HTTP_200_OK,
)
def health_check():
    """
    Health check endpoint.

    Returns:
        JSONResponse with healthy status, service name, version, and UTC timestamp.
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": settings.PROJECT_VERSION,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    )
