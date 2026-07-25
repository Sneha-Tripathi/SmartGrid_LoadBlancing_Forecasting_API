from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db.session import get_db
from app.models.smart_meter import SmartMeter
from app.models.user import User
from app.schemas.smart_meter import (
    SmartMeterCreate,
    SmartMeterResponse,
)

router = APIRouter(
    prefix="/meters",
    tags=["Meters"],
)


@router.post(
    "/",
    response_model=SmartMeterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_meter(
    meter: SmartMeterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_meter = SmartMeter(**meter.model_dump())

    db.add(new_meter)
    db.commit()
    db.refresh(new_meter)

    return new_meter


@router.get(
    "/",
    response_model=List[SmartMeterResponse],
)
def get_all_meters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(SmartMeter).all()


@router.get(
    "/{meter_id}",
    response_model=SmartMeterResponse,
)
def get_meter(
    meter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    return meter


@router.put(
    "/{meter_id}",
    response_model=SmartMeterResponse,
)
def update_meter(
    meter_id: int,
    meter_data: SmartMeterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    meter.meter_number = meter_data.meter_number
    meter.zone = meter_data.zone
    meter.consumer_name = meter_data.consumer_name
    meter.current_load = meter_data.current_load

    db.commit()
    db.refresh(meter)

    return meter


@router.delete("/{meter_id}")
def delete_meter(
    meter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    db.delete(meter)
    db.commit()

    return {
        "success": True,
        "message": "Smart Meter deleted successfully",
    }