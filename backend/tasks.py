from celery_app import celery
from database import SessionLocal
from models import MeterData
from logging_config import logger
import datetime
import crud


@celery.task
def calculate_load():
    logger.info("=" * 50)
    logger.info("Periodic Task Starting")
    logger.info(f"Time: {datetime.datetime.now()}")

    db = SessionLocal()

    records = db.query(MeterData).all()

    logger.info(f"Total Records Found: {len(records)}")

    for record in records:

        logger.info(
            f"Processing Record ID {record.id}: "
            f"Voltage={record.voltage}, "
            f"Current={record.current}, "
            f"Power={record.power}"
        )

        # High Load Detection
        status = "NORMAL"

        if record.power > 1200:
            status = "CRITICAL"

        elif record.power >= 1000:
            status = "WARNING"

        logger.info(f"Status for Record ID {record.id}: {status}")

        if status != "NORMAL":

            crud.create_alert(
                db=db,
                zone="Zone A",
                load=record.power,
                status=status
            )

            logger.warning(f"Alert Generated! Zone=Zone A, Load={record.power}, Status={status}")

    db.close()

    result_msg = f"{len(records)} records processed"
    logger.info(f"Periodic Task Completed: {result_msg}")
    logger.info("=" * 50)

    return result_msg
