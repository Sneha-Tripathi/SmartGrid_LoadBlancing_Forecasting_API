from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.websocket import websocket_endpoint
from app.api.status import router as status_router
from app.routers import energy, analytics, meter, auth, alert, dashboard, health

# Configure logging at startup
configure_logging()

logger = get_logger(__name__)

# -------------------------------
# FastAPI App
# -------------------------------

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="Dummy Backend for Smart Grid Load Balancing & Forecasting System",
    version="1.0.0",
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

# -------------------------------
# Include Routers
# -------------------------------

app.include_router(status_router)
app.include_router(energy.router)
app.include_router(analytics.router)
app.include_router(meter.router)
app.include_router(auth.router)
app.include_router(alert.router)
app.include_router(dashboard.router)
app.include_router(health.router)

# -------------------------------
# CORS
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Root
# -------------------------------

@app.get("/")
def root():
    return {
        "message": "Smart Grid Load Balancing API Running Successfully",
        "status": "success",
        "version": "1.0.0",
    }

# -------------------------------
# Dashboard Cards
# -------------------------------

@app.get("/dashboard/cards")
def dashboard_cards():
    return {
        "current_load": 2.54,
        "peak_load": 3.91,
        "active_zones": 18,
        "grid_health": 98,
    }



# -------------------------------
# Alerts
# -------------------------------

@app.get("/alerts")
def alerts():
    return [
        {
            "title": "High Load",
            "zone": "North Zone",
            "time": "2 min ago",
        },
        {
            "title": "Voltage Drop",
            "zone": "West Zone",
            "time": "8 min ago",
        },
        {
            "title": "Grid Balanced",
            "zone": "Central Zone",
            "time": "15 min ago",
        },
    ]

# -------------------------------
# Recent Activity
# -------------------------------

@app.get("/activity")
def activity():
    return [
        {
            "time": "09:45",
            "event": "Load Forecast Generated",
        },
        {
            "time": "09:30",
            "event": "New Meter Connected",
        },
        {
            "time": "09:12",
            "event": "Voltage Restored",
        },
        {
            "time": "08:58",
            "event": "Critical Alert Resolved",
        },
    ]

# -------------------------------
# Application Events
# -------------------------------


@app.on_event("startup")
async def startup_event():
    """Log application startup."""
    logger.info(
        "%s v%s is starting up",
        settings.PROJECT_NAME,
        settings.PROJECT_VERSION,
    )
    logger.info("Log level: %s", settings.LOG_LEVEL)
    logger.info("Metrics enabled: %s", settings.ENABLE_METRICS)
    logger.info("Rate limiting enabled: %s", settings.RATE_LIMIT_ENABLED)
    logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Log application shutdown."""
    logger.info("%s is shutting down", settings.PROJECT_NAME)
    metrics = metrics_collector.get_metrics()
    logger.info(
        "Session summary: %d requests processed, %d errors",
        metrics["requests"]["total"],
        metrics["errors"]["total"],
    )
    logger.info("Shutdown complete")


# -------------------------------
# WebSocket
# -------------------------------

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)
