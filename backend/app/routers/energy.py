from fastapi import APIRouter

router = APIRouter(
    prefix="/energy",
    tags=["Energy"],
)


@router.get("/load-trend")
def load_trend():
    return [
        {"time": "10 AM", "load": 210},
        {"time": "11 AM", "load": 240},
        {"time": "12 PM", "load": 280},
        {"time": "1 PM", "load": 260},
        {"time": "2 PM", "load": 310},
        {"time": "3 PM", "load": 295},
    ]


@router.get("/forecast")
def energy_forecast():
    return [
        {"day": "Mon", "value": 300},
        {"day": "Tue", "value": 340},
        {"day": "Wed", "value": 320},
        {"day": "Thu", "value": 360},
        {"day": "Fri", "value": 390},
    ]


@router.get("/zones")
def zones():
    return [
        {"name": "North", "value": 35},
        {"name": "South", "value": 25},
        {"name": "East", "value": 20},
        {"name": "West", "value": 20},
    ]


@router.get("/consumption")
def consumption():
    return [
        {"zone": "North", "power": 420},
        {"zone": "South", "power": 350},
        {"zone": "East", "power": 310},
        {"zone": "West", "power": 390},
    ]
