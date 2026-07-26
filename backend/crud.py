from sqlalchemy.orm import Session
from models import MeterData, AggregatedLoad, Alert


# ==========================
# Meter Data CRUD
# ==========================

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
    return db.query(MeterData).filter(
        MeterData.id == meter_id
    ).first()


def update_meter_data(db: Session, meter_id: int, data):
    meter = db.query(MeterData).filter(
        MeterData.id == meter_id
    ).first()

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
    meter = db.query(MeterData).filter(
        MeterData.id == meter_id
    ).first()

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


# ==========================
# Aggregated Load CRUD
# ==========================

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


# ==========================
# Alert CRUD
# ==========================

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


# API se alert create karne ke liye
def create_alert_api(db: Session, alert):
    new_alert = Alert(
        zone=alert.zone,
        load=alert.load,
        status=alert.status
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return new_alert


def get_alerts(db: Session):
    return (
        db.query(Alert)
        .order_by(Alert.id.desc())
        .all()
    )


def get_alert(db: Session, alert_id: int):
    return (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )


def delete_alert(db: Session, alert_id: int):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if alert is None:
        return None

    db.delete(alert)
    db.commit()

    return alert


def get_alert_by_status(db: Session, status: str):
    return (
        db.query(Alert)
        .filter(Alert.status == status)
        .all()
    )