from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session

import crud
import schemas

from schemas import AlertOut
from database import SessionLocal
from logging_config import logger

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="API for managing Smart Meter Data with load balancing, aggregation, threshold detection, and alert generation.",
    version="1.0.0",
    contact={
        "name": "Smart Grid Team",
    },
    license_info={
        "name": "MIT",
    },
)


# =====================================================
# Database Dependency
# =====================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# Global Exception Handlers (Day 16)
# =====================================================

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    """Handle 404 Not Found errors."""
    logger.error(f"404 Not Found: {request.url.path} - {exc.detail}")
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "The requested resource was not found",
            "error": str(exc.detail),
        },
    )


@app.exception_handler(400)
async def bad_request_handler(request: Request, exc: HTTPException):
    """Handle 400 Bad Request errors."""
    logger.error(f"400 Bad Request: {request.url.path} - {exc.detail}")
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": "Bad request",
            "error": str(exc.detail),
        },
    )


@app.exception_handler(422)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    """Handle 422 Validation errors."""
    errors = exc.errors()
    logger.error(f"422 Validation Error: {request.url.path} - {errors}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "error": errors,
        },
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception):
    """Handle 500 Internal Server Errors."""
    logger.exception(f"500 Internal Error: {request.url.path} - {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": "An unexpected error occurred. Please try again later.",
        },
    )


@app.exception_handler(Exception)
async def unexpected_error_handler(request: Request, exc: Exception):
    """Handle any unexpected errors."""
    logger.exception(f"Unexpected Error: {request.url.path} - {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred",
            "error": str(exc),
        },
    )


# =====================================================
# Middleware: Log all API requests
# =====================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every incoming API request and its response status."""
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response: {request.method} {request.url.path} -> {response.status_code}")
    return response


# =====================================================
# Home API
# =====================================================

@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Returns a simple health check message to confirm the API is running.",
    response_description="Health check response",
    tags=["Health"],
)
def home():
    logger.info("Health check endpoint called")
    return {"message": "Smart Grid API Running"}


# =====================================================
# Meter Data APIs
# =====================================================

@app.post(
    "/meter-data",
    response_model=schemas.MeterDataResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Meter Data",
    description="Create a new meter data record with voltage, current, power, and frequency readings.",
    response_description="The created meter data record",
    tags=["Meter Data"],
)
def create_data(
    data: schemas.MeterDataCreate,
    db: Session = Depends(get_db)
):
    logger.info(f"Creating meter data: voltage={data.voltage}, current={data.current}, power={data.power}, frequency={data.frequency}")
    return crud.create_meter_data(db, data)


@app.get(
    "/meter-data",
    response_model=list[schemas.MeterDataResponse],
    summary="Get All Meter Data",
    description="Retrieve a list of all meter data records in the system.",
    response_description="List of all meter data records",
    tags=["Meter Data"],
)
def get_data(db: Session = Depends(get_db)):
    logger.info("Fetching all meter data")
    return crud.get_all_meter_data(db)


@app.get(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse,
    summary="Get Meter Data by ID",
    description="Retrieve a single meter data record by its unique ID.",
    response_description="The requested meter data record",
    tags=["Meter Data"],
)
def get_single_data(
    meter_id: int,
    db: Session = Depends(get_db)
):
    logger.info(f"Fetching meter data with ID: {meter_id}")
    meter = crud.get_meter_data_by_id(db, meter_id)

    if meter is None:
        logger.warning(f"Meter data with ID {meter_id} not found")
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    return meter


@app.put(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse,
    summary="Update Meter Data",
    description="Update an existing meter data record by its unique ID.",
    response_description="The updated meter data record",
    tags=["Meter Data"],
)
def update_data(
    meter_id: int,
    data: schemas.MeterDataUpdate,
    db: Session = Depends(get_db)
):
    logger.info(f"Updating meter data with ID: {meter_id}")
    meter = crud.update_meter_data(db, meter_id, data)

    if meter is None:
        logger.warning(f"Meter data with ID {meter_id} not found for update")
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    logger.info(f"Meter data ID {meter_id} updated successfully")
    return meter


@app.delete(
    "/meter-data/{meter_id}",
    summary="Delete Meter Data",
    description="Delete a meter data record by its unique ID.",
    response_description="Success message indicating deletion",
    tags=["Meter Data"],
)
def delete_data(
    meter_id: int,
    db: Session = Depends(get_db)
):
    logger.info(f"Deleting meter data with ID: {meter_id}")
    meter = crud.delete_meter_data(db, meter_id)

    if meter is None:
        logger.warning(f"Meter data with ID {meter_id} not found for deletion")
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    logger.info(f"Meter data ID {meter_id} deleted successfully")
    return {
        "message": "Record deleted successfully"
    }


# =====================================================
# Alert APIs
# =====================================================

# Create Alert

@app.post(
    "/alerts",
    response_model=AlertOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create Alert",
    description="Create a new alert record with zone, load, and status information.",
    response_description="The created alert record",
    tags=["Alerts"],
)
def create_alert(
    alert: schemas.AlertCreate,
    db: Session = Depends(get_db)
):
    logger.info(
        f"Creating alert - Zone: {alert.zone}, Load: {alert.load}, Status: {alert.status}"
    )

    return crud.create_alert_api(db, alert)




# Get All Alerts

@app.get(
    "/alerts",
    response_model=list[AlertOut],
    summary="Get All Alerts",
    tags=["Alerts"],
)
def read_alerts(db: Session = Depends(get_db)):
    logger.info("Fetching all alerts")
    return crud.get_alerts(db)


# Get Single Alert

@app.get(
    "/alerts/{alert_id}",
    response_model=AlertOut,
    summary="Get Alert By ID",
    tags=["Alerts"],
)
def read_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    logger.info(f"Fetching alert ID: {alert_id}")

    alert = crud.get_alert(db, alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    return alert


# Delete Alert

@app.delete(
    "/alerts/{alert_id}",
    summary="Delete Alert",
    tags=["Alerts"],
)
def remove_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = crud.delete_alert(db, alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    logger.info(f"Alert {alert_id} deleted")

    return {
        "message": "Alert Deleted Successfully"
    }


# Filter Alerts

@app.get(
    "/alerts/status/{status}",
    response_model=list[AlertOut],
    summary="Filter Alerts By Status",
    tags=["Alerts"],
)
def filter_alert(
    status: str,
    db: Session = Depends(get_db)
):
    logger.info(f"Filtering alerts: {status}")
    return crud.get_alert_by_status(db, status)