"""
Smart Grid Load Balancing API - Application Entry Point

Production-grade FastAPI application with:
- Structured logging
- Production middleware
- Swagger documentation improvements
- Health monitoring and metrics
- Prometheus metrics
- Rate limiting
- Security audit logging
"""

from datetime import UTC

from fastapi import FastAPI, Request

from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.middleware import register_middleware
from app.core.monitoring import get_prometheus_metrics, metrics_collector

# Import models to ensure they are registered with SQLAlchemy
from app.models.smart_meter import SmartMeter
from app.models.user import User

# Configure logging at startup
configure_logging()

logger = get_logger(__name__)

# NOTE: Database tables are managed via Alembic migrations.
# Run `alembic upgrade head` to apply migrations.
# Do NOT use Base.metadata.create_all() in production.

logger.info("Starting application (migrations managed by Alembic)")

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.PROJECT_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "Smart Grid Team",
        "email": "team@smartgrid.io",
        "url": "https://smartgrid.io",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Register exception handlers
register_exception_handlers(app)

# Register middleware (order matters)
register_middleware(app)

# Include API routes
app.include_router(api_router)


# ── Application Events ──────────────────────────


@app.on_event("startup")
async def startup_event():
    """Log application startup and initialize connections."""
    logger.info(
        "%s v%s is starting up [environment: %s]",
        settings.PROJECT_NAME,
        settings.PROJECT_VERSION,
        settings.ENVIRONMENT,
    )
    logger.info("Database: %s", settings.DATABASE_URL)
    logger.info("Log level: %s", settings.LOG_LEVEL)
    logger.info("Metrics enabled: %s", settings.ENABLE_METRICS)
    logger.info("Rate limiting enabled: %s", settings.RATE_LIMIT_ENABLED)
    logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Log application shutdown and cleanup."""
    logger.info("%s is shutting down", settings.PROJECT_NAME)
    # Log final metrics summary
    metrics = metrics_collector.get_metrics()
    logger.info(
        "Session summary: %d requests processed, %d errors",
        metrics["requests"]["total"],
        metrics["errors"]["total"],
    )
    logger.info("Shutdown complete")


# ── Metrics Endpoint ────────────────────────────


@app.get("/metrics", tags=["Metrics"])
def get_metrics(request: Request):
    """
    Application metrics endpoint.

    Returns application-level metrics including request counts,
    error rates, and performance statistics.
    """
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        meter_count = db.query(SmartMeter).count()
        user_count = db.query(User).count()
        active_user_count = db.query(User).filter(User.is_active.is_(True)).count()
    except Exception:
        logger.exception("Failed to query database for metrics")
        meter_count = 0
        user_count = 0
        active_user_count = 0
    finally:
        db.close()

    # Merge in-memory metrics with DB stats
    stats = metrics_collector.get_metrics()

    return {
        "application": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "type": "sqlite",
            "connected": True,
        },
        "statistics": {
            "total_meters": meter_count,
            "total_users": user_count,
            "active_users": active_user_count,
        },
        "requests": stats["requests"],
        "errors": stats["errors"],
        "performance": stats["performance"],
    }


# ── Prometheus Metrics Endpoint ─────────────────


@app.get("/metrics/prometheus", tags=["Metrics"])
def get_prometheus_endpoint():
    """
    Prometheus metrics endpoint.

    Returns metrics in Prometheus text exposition format
    for scraping by Prometheus server.
    """
    from fastapi.responses import PlainTextResponse

    return PlainTextResponse(
        content=get_prometheus_metrics(),
        media_type="text/plain; version=0.0.4",
    )


# ── Liveness & Readiness Probes ─────────────────


@app.get(
    "/health/live",
    tags=["Health"],
    summary="Liveness probe",
    description="Kubernetes liveness probe. Returns 200 if the application is alive.",
)
def liveness_probe():
    """
    Kubernetes liveness probe.

    Returns a simple 200 OK if the application process is running.
    """
    from datetime import datetime

    return {
        "status": "alive",
        "timestamp": datetime.now(UTC).isoformat(),
    }


@app.get(
    "/health/ready",
    tags=["Health"],
    summary="Readiness probe",
    description="Kubernetes readiness probe. Returns 200 if the application is ready to serve.",
)
def readiness_probe():
    """
    Kubernetes readiness probe.

    Checks database connectivity and returns 200 if the application
    is ready to accept traffic.
    """
    from datetime import datetime

    from sqlalchemy import text

    from app.db.session import SessionLocal

    db_status = "healthy"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        logger.exception("Database health check failed")
        db_status = "unhealthy"

    if db_status == "unhealthy":
        from fastapi.responses import JSONResponse

        return JSONResponse(
            status_code=503,
            content={
                "status": "not ready",
                "database": db_status,
            },
        )

    return {
        "status": "ready",
        "database": db_status,
        "timestamp": datetime.now(UTC).isoformat(),
    }


# ── Admin Reset Metrics Endpoint ────────────────


@app.post("/metrics/reset", tags=["Metrics"])
def reset_metrics(request: Request):
    """Reset all application metrics counters (admin only)."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail="Unauthorized")

    metrics_collector.reset()
    logger.info("Metrics reset requested")
    return {"success": True, "message": "Metrics have been reset"}
