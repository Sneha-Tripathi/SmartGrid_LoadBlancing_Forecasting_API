from fastapi import APIRouter
from app.data.dummyData import dashboard_cards, activities

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/cards")
def get_dashboard_cards():
    return dashboard_cards

@router.get("/activity")
def get_recent_activity():
    return activities