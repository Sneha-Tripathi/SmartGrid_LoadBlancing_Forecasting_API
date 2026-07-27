from sqlalchemy.orm import Session
from models import MeterData, AggregatedLoad, Alert
from logging_config import logger


# =====================================================
# Meter Data CRUD
# =====================================================

def create_meter_data(db: Session, data):
    logger.info("Creating new meter data record")

    meter = MeterData(
        voltage=data.voltage,
        current=data.current,
        power=data.power,
        frequency=data.frequency
    )

    db.add(meter)
    db.commit()
    db.refresh(meter)

    logger.info(f"Meter data created with ID: {meter.id}")
    return meter


def get_all_meter_data(db: Session):
    logger.info("Retrieving all meter data records")

    records = db.query(MeterData).all()

    logger.info(f"Retrieved {len(records)} meter data records")
    return records


def get_meter_data_by_id(db: Session, meter_id: int):
    logger.info(f"Searching meter data ID: {meter_id}")

    meter = (
        db.query(MeterData)
        .filter(MeterData.id == meter_id)
        .first()
    )

    if meter:
        logger.info("Meter data found")
    else:
        logger.warning("Meter data not found")

    return meter


def update_meter_data(db: Session, meter_id: int, data):
    logger.info(f"Updating meter data ID: {meter_id}")

    meter = (
        db.query(MeterData)
        .filter(MeterData.id == meter_id)
        .first()
    )

    if meter is None:
        logger.warning("Meter data not found")
        return None

    meter.voltage = data.voltage
    meter.current = data.current
    meter.power = data.power
    meter.frequency = data.frequency

    db.commit()
    db.refresh(meter)

    logger.info("Meter data updated successfully")
    return meter


def delete_meter_data(db: Session, meter_id: int):
    logger.info(f"Deleting meter data ID: {meter_id}")

    meter = (
        db.query(MeterData)
        .filter(MeterData.id == meter_id)
        .first()
    )

    if meter is None:
        logger.warning("Meter data not found")
        return None

    db.delete(meter)
    db.commit()

    logger.info("Meter data deleted successfully")
    return meter


def get_latest_meter_data(db: Session):
    logger.info("Fetching latest meter data")

    return (
        db.query(MeterData)
        .order_by(MeterData.id.desc())
        .first()
    )


# =====================================================
# Aggregated Load CRUD
# =====================================================

def create_aggregated_load(
    db: Session,
    zone: str,
    avg_voltage: float,
    avg_current: float,
    avg_power: float
):
    logger.info(f"Creating aggregated load for {zone}")

    load = AggregatedLoad(
        zone=zone,
        average_voltage=avg_voltage,
        average_current=avg_current,
        average_power=avg_power
    )

    db.add(load)
    db.commit()
    db.refresh(load)

    logger.info(f"Aggregated load created with ID {load.id}")

    return load


# =====================================================
# Alert CRUD
# =====================================================

def create_alert(
    db: Session,
    zone: str,
    load: float,
    status: str
):
    logger.info(
        f"Creating Alert | Zone={zone} | Load={load} | Status={status}"
    )

    alert = Alert(
        zone=zone,
        load=load,
        status=status
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    logger.info(f"Alert created with ID {alert.id}")

    return alert


def create_alert_api(
    db: Session,
    alert
):
    logger.info("Creating Alert from API")

    new_alert = Alert(
        zone=alert.zone,
        load=alert.load,
        status=alert.status
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    logger.info(f"Alert created via API with ID {new_alert.id}")

    return new_alert


def get_alerts(db: Session):
    logger.info("Fetching all alerts")

    return (
        db.query(Alert)
        .order_by(Alert.id.desc())
        .all()
    )


def get_alert(
    db: Session,
    alert_id: int
):
    logger.info(f"Fetching alert ID {alert_id}")

    return (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )


def delete_alert(
    db: Session,
    alert_id: int
):
    logger.info(f"Deleting alert ID {alert_id}")

    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if alert is None:
        logger.warning("Alert not found")
        return None

    db.delete(alert)
    db.commit()

    logger.info("Alert deleted successfully")

    return alert


def get_alert_by_status(
    db: Session,
    status: str
):
    logger.info(f"Filtering alerts by status {status}")

    return (
        db.query(Alert)
        .filter(Alert.status == status)
        .all()
    )