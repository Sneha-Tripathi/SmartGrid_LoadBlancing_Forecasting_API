from celery_app import celery
from database import SessionLocal
from models import MeterData
import datetime
import crud


@celery.task
def calculate_load():
    db = SessionLocal()

    records = db.query(MeterData).all()

    print("=" * 50)
    print("Periodic Task Running")
    print("Time:", datetime.datetime.now())
    print("Total Records:", len(records))

    for record in records:

        print(
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

        print(f"Status : {status}")

        if status != "NORMAL":

            crud.create_alert(
                db=db,
                zone="Zone A",
                load=record.power,
                status=status
            )

            print(f"⚠ {status} Alert Generated!")

    db.close()

    return f"{len(records)} records processed"