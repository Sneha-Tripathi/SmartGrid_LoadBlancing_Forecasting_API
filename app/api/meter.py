from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.smart_meter import SmartMeter
from app.schemas.smart_meter import SmartMeterCreate, SmartMeterResponse

router = APIRouter(prefix="/meters", tags=["Meters"])


@router.post(
    "/",
    response_model=SmartMeterResponse,
    status_code=status.HTTP_201_CREATED
)
def create_meter(
    meter: SmartMeterCreate,
    db: Session = Depends(get_db)
):
    new_meter = SmartMeter(
        meter_number=meter.meter_number,
        zone=meter.zone,
        consumer_name=meter.consumer_name,
        current_load=meter.current_load,
    )

    db.add(new_meter)
    db.commit()
    db.refresh(new_meter)

    return new_meter