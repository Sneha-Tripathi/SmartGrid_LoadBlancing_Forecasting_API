"""
Health & Metrics Endpoints

Provides health probes (liveness, readiness) and metrics endpoints.
Adapted from Sakshi_Project for the main backend.
"""

from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import get_logger
from app.core.monitoring import get_prometheus_metrics, metrics_collector

logger = get_logger(__name__)

router = APIRouter(tags=["Health & Metrics"])


@router.get(
    "/health",
    summary="Health check",
    description="Checks whether the API service is healthy and operational.",
    response_description="Health status with timestamp",
    status_code=status.HTTP_200_OK,
)
def health_check():
    """Health check endpoint returning service status."""
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": settings.PROJECT_VERSION,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    )


@router.get(
    "/health/live",
    summary="Liveness probe",
    description="Kubernetes liveness probe. Returns 200 if the application is alive.",
)
def liveness_probe():
    """Kubernetes liveness probe."""
    return {
        "status": "alive",
        "timestamp": datetime.now(UTC).isoformat(),
    }


@router.get(
    "/health/ready",
    summary="Readiness probe",
    description="Kubernetes readiness probe. Returns 200 if the application is ready.",
)
def readiness_probe():
    """Kubernetes readiness probe."""
    return {
        "status": "ready",
        "timestamp": datetime.now(UTC).isoformat(),
    }


@router.get(
    "/metrics",
    summary="Application metrics",
    description="Returns application-level metrics including request counts, error rates, and performance statistics.",
)
def get_metrics():
    """Application metrics endpoint."""
    stats = metrics_collector.get_metrics()
    return {
        "application": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "requests": stats["requests"],
        "errors": stats["errors"],
        "performance": stats["performance"],
    }


@router.get(
    "/metrics/prometheus",
    summary="Prometheus metrics",
    description="Returns metrics in Prometheus text exposition format.",
)
def get_prometheus_endpoint():
    """Prometheus metrics endpoint."""
    from fastapi.responses import PlainTextResponse

    return PlainTextResponse(
        content=get_prometheus_metrics(),
        media_type="text/plain; version=0.0.4",
    )


@router.post(
    "/metrics/reset",
    summary="Reset metrics",
    description="Reset all application metrics counters.",
)
def reset_metrics(request: Request):
    """Reset all application metrics."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    metrics_collector.reset()
    logger.info("Metrics reset requested")
    return {"success": True, "message": "Metrics have been reset"}
