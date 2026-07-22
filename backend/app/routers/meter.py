from fastapi import APIRouter
from app.data.dummyData import meter_data

router = APIRouter(
    prefix="/meters",
    tags=["Meters"]
)

@router.get("/")
def get_all_meters():
    return meter_data