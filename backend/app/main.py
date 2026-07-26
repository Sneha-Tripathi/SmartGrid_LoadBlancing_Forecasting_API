from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.websocket import websocket_endpoint
from app.api.status import router as status_router
from app.routers import energy, analytics, meter, auth

# -------------------------------
# FastAPI App
# -------------------------------

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="Dummy Backend for Smart Grid Load Balancing & Forecasting System",
    version="1.0.0",
)

# -------------------------------
# Include Routers
# -------------------------------

app.include_router(status_router)
app.include_router(energy.router)
app.include_router(analytics.router)
app.include_router(meter.router)
app.include_router(auth.router)

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
# WebSocket
# -------------------------------

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)
