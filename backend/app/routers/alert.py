from fastapi import APIRouter
from app.data.dummyData import alerts

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)

@router.get("/")
def get_alerts():
    return alerts