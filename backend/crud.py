from sqlalchemy.orm import Session
from models import MeterData


def create_meter_data(db: Session, data):
    meter = MeterData(
        voltage=data.voltage,
        current=data.current,
        power=data.power,
        frequency=data.frequency
    )

    db.add(meter)
    db.commit()
    db.refresh(meter)

    return meter


def get_all_meter_data(db: Session):
    return db.query(MeterData).all()