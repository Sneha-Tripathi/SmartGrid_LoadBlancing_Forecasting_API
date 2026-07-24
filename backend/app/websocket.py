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


async def generate_live_data():

    status = random.choice(
    [
        "Normal",
        "Warning",
        "Critical",
    ]
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

    "timestamp": datetime.now().strftime("%H:%M:%S")

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