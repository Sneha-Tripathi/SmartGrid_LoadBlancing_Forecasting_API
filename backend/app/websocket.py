from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import random
from datetime import datetime


class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("Client Connected")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print("Client Disconnected")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)


manager = ConnectionManager()


def _random_chart_data():
    hours = [f"{h}:00" for h in range(6, 23)]
    return [
        {"time": h, "load": round(random.uniform(180, 420), 1)}
        for h in hours
    ]


def _random_consumption():
    zones = ["North", "South", "East", "West"]
    return [
        {"zone": z, "power": round(random.uniform(280, 480), 1)}
        for z in zones
    ]


def _random_forecast():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    return [
        {"day": d, "value": round(random.uniform(280, 410), 1)}
        for d in days
    ]


def _random_zones():
    return [
        {"name": "North", "value": random.randint(25, 40)},
        {"name": "South", "value": random.randint(20, 35)},
        {"name": "East", "value": random.randint(15, 30)},
        {"name": "West", "value": random.randint(15, 30)},
    ]


async def generate_live_data():

    status = random.choice(
    ["Normal", "Warning", "Critical"]
)

    alert_messages = {
    "Normal": "Grid operating normally",
    "Warning": "High load detected",
    "Critical": "Critical load imbalance detected"
    }

    return {

    "current_load": round(random.uniform(2.1,4.8),2),
    "peak_load": round(random.uniform(4.0,5.5),2),
    "active_zones": random.randint(15,20),
    "grid_health": random.randint(95,100),
    "status": status,
    "alert": alert_messages[status],
    "timestamp": datetime.now().strftime("%H:%M:%S"),

    # Analytics data for real-time dashboard cards
    "analytics": {
        "today_energy": round(random.uniform(45.2, 68.7), 1),
        "weekly_usage": round(random.uniform(1200, 1900), 1),
        "monthly_usage": round(random.uniform(5200, 7800), 1),
        "prediction_accuracy": round(random.uniform(91.0, 99.5), 1),
        "carbon_saved": round(random.uniform(12.0, 28.5), 1),
        "ai_efficiency": round(random.uniform(82.0, 97.0), 1),
    },

    # Chart data for real-time updates
    "chart_data": {
        "load_trend": _random_chart_data(),
        "forecast": _random_forecast(),
        "consumption": _random_consumption(),
        "zones": _random_zones(),
    },

    }



async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:

        while True:

            data = await generate_live_data()

            await manager.send_personal_message(
                data,
                websocket,
            )

            await asyncio.sleep(3)

    except WebSocketDisconnect:

        manager.disconnect(websocket)