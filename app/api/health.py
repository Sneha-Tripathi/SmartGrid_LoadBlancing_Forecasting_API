from datetime import datetime, UTC

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/", tags=["Root"])
def root():
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "message": "Smart Grid API is Running 🚀"
        }
    )


@router.get(
    "/health",
    tags=["Health"],
    summary="Health Check",
    description="Checks whether the API service is healthy."
)
def health_check():
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "Smart Grid Load Balancing API",
            "version": "1.0.0",
            "timestamp": datetime.now(UTC).isoformat()
        }
    )