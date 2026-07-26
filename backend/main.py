from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas

from schemas import AlertOut
from database import SessionLocal

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="API for managing Smart Meter Data",
    version="1.0.0"
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
# Home API
# =====================================================

@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return {"message": "Smart Grid API Running"}


# =====================================================
# Meter Data APIs
# =====================================================

@app.post(
    "/meter-data",
    response_model=schemas.MeterDataResponse,
    status_code=status.HTTP_201_CREATED
)
def create_data(
    data: schemas.MeterDataCreate,
    db: Session = Depends(get_db)
):
    return crud.create_meter_data(db, data)


@app.get(
    "/meter-data",
    response_model=list[schemas.MeterDataResponse]
)
def get_data(db: Session = Depends(get_db)):
    return crud.get_all_meter_data(db)


@app.get(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse
)
def get_single_data(
    meter_id: int,
    db: Session = Depends(get_db)
):
    meter = crud.get_meter_data_by_id(db, meter_id)

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    return meter


@app.put(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse
)
def update_data(
    meter_id: int,
    data: schemas.MeterDataUpdate,
    db: Session = Depends(get_db)
):
    meter = crud.update_meter_data(db, meter_id, data)

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    return meter


@app.delete("/meter-data/{meter_id}")
def delete_data(
    meter_id: int,
    db: Session = Depends(get_db)
):
    meter = crud.delete_meter_data(db, meter_id)

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

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
    status_code=status.HTTP_201_CREATED
)
def create_alert(
    alert: schemas.AlertCreate,
    db: Session = Depends(get_db)
):
    return crud.create_alert_api(db, alert)


# Get All Alerts

@app.get(
    "/alerts",
    response_model=list[AlertOut]
)
def read_alerts(
    db: Session = Depends(get_db)
):
    return crud.get_alerts(db)


# Get Single Alert

@app.get(
    "/alerts/{alert_id}",
    response_model=AlertOut
)
def read_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = crud.get_alert(db, alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    return alert


# Delete Alert

@app.delete("/alerts/{alert_id}")
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

    return {
        "message": "Alert Deleted Successfully"
    }


# Filter Alerts by Status

@app.get(
    "/alerts/status/{status}",
    response_model=list[AlertOut]
)
def filter_alert(
    status: str,
    db: Session = Depends(get_db)
):
    return crud.get_alert_by_status(db, status)