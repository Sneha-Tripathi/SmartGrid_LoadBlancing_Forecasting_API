from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import WebSocket
from app.websocket import websocket_endpoint

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="Dummy Backend for Smart Grid Load Balancing & Forecasting System",
    version="1.0.0",
)

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

        "current_load": "2.54 MW",

        "peak_load": "3.91 MW",

        "active_zones": 18,

        "grid_health": "98%"

    }


# -------------------------------
# Forecast Chart
# -------------------------------

@app.get("/forecast")
def forecast():

    return {

        "labels": [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ],

        "values": [
            2.3,
            2.8,
            2.5,
            3.1,
            2.9,
            3.4,
            3.0,
        ],

    }


# -------------------------------
# Meter Monitoring
# -------------------------------

@app.get("/meters")
def meters():

    return [

        {
            "id": "MTR-101",
            "zone": "North",
            "load": "2.45 MW",
            "status": "Normal",
        },

        {
            "id": "MTR-102",
            "zone": "South",
            "load": "3.82 MW",
            "status": "High",
        },

        {
            "id": "MTR-103",
            "zone": "East",
            "load": "1.98 MW",
            "status": "Normal",
        },

        {
            "id": "MTR-104",
            "zone": "West",
            "load": "4.76 MW",
            "status": "Critical",
        },

        {
            "id": "MTR-105",
            "zone": "Central",
            "load": "2.89 MW",
            "status": "Normal",
        },

    ]


# -------------------------------
# Alerts
# -------------------------------

@app.get("/alerts")
def alerts():

    return [

        {

            "title": "High Load",

            "zone": "North Zone",

            "time": "2 min ago"

        },

        {

            "title": "Voltage Drop",

            "zone": "West Zone",

            "time": "8 min ago"

        },

        {

            "title": "Grid Balanced",

            "zone": "Central Zone",

            "time": "15 min ago"

        }

    ]


# -------------------------------
# Recent Activity
# -------------------------------

@app.get("/activity")
def activity():

    return [
        {
            "time": "09:45",
            "event": "Load Forecast Generated"
        },
        {
            "time": "09:30",
            "event": "New Meter Connected"
        },
        {
            "time": "09:12",
            "event": "Voltage Restored"
        },
        {
            "time": "08:58",
            "event": "Critical Alert Resolved"
        }
    ]


# -------------------------------
# WebSocket
# -------------------------------

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)

# --------------------------------
# Energy Load Trend
# --------------------------------

@app.get("/energy/load-trend")
def load_trend():

    return [

        {"time": "10 AM", "load": 210},
        {"time": "11 AM", "load": 240},
        {"time": "12 PM", "load": 280},
        {"time": "1 PM", "load": 260},
        {"time": "2 PM", "load": 310},
        {"time": "3 PM", "load": 295},

    ]


# --------------------------------
# Forecast
# --------------------------------

@app.get("/energy/forecast")
def forecast():

    return [

        {"day": "Mon", "value": 300},
        {"day": "Tue", "value": 340},
        {"day": "Wed", "value": 320},
        {"day": "Thu", "value": 360},
        {"day": "Fri", "value": 390},

    ]


# --------------------------------
# Zone Distribution
# --------------------------------

@app.get("/energy/zones")
def zones():

    return [

        {"name": "North", "value": 35},
        {"name": "South", "value": 25},
        {"name": "East", "value": 20},
        {"name": "West", "value": 20},

    ]


# --------------------------------
# Power Consumption
# --------------------------------

@app.get("/energy/consumption")
def consumption():

    return [

        {"zone": "North", "power": 420},
        {"zone": "South", "power": 350},
        {"zone": "East", "power": 310},
        {"zone": "West", "power": 390},

    ]