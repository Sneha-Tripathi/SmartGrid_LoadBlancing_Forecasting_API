from sqlalchemy.orm import Session
from models import MeterData, AggregatedLoad
from models import Alert


def create_alert(db, zone, load, status):
    alert = Alert(
        zone=zone,
        load=load,
        status=status
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


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


def get_meter_data_by_id(db: Session, meter_id: int):
    return db.query(MeterData).filter(MeterData.id == meter_id).first()


def update_meter_data(db: Session, meter_id: int, data):
    meter = db.query(MeterData).filter(MeterData.id == meter_id).first()

    if meter is None:
        return None

    meter.voltage = data.voltage
    meter.current = data.current
    meter.power = data.power
    meter.frequency = data.frequency

    db.commit()
    db.refresh(meter)

    return meter


def delete_meter_data(db: Session, meter_id: int):
    meter = db.query(MeterData).filter(MeterData.id == meter_id).first()

    if meter is None:
        return None

    db.delete(meter)
    db.commit()

    return meter


def get_latest_meter_data(db: Session):
    return (
        db.query(MeterData)
        .order_by(MeterData.id.desc())
        .first()
    )


def create_aggregated_load(
    db,
    zone,
    avg_voltage,
    avg_current,
    avg_power
):

    load = AggregatedLoad(
        zone=zone,
        average_voltage=avg_voltage,
        average_current=avg_current,
        average_power=avg_power
    )

    db.add(load)
    db.commit()
    db.refresh(load)

    return load

def create_alert(db, zone, load, status):
    alert = Alert(
        zone=zone,
        load=load,
        status=status
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert