from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
async def system_status():

    return {

        "backend": "Online",
        "database": "Connected",
        "ai": "Running"

    }