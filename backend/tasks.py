from celery_app import celery
from database import SessionLocal
import crud


@celery.task
def aggregate_zone_load():

    db = SessionLocal()

    try:

        meter = crud.get_latest_meter_data(db)

        if meter is None:
            return "No Data Found"

        zone = "Zone A"

        result = crud.create_aggregated_load(
            db=db,
            zone=zone,
            avg_voltage=meter.voltage,
            avg_current=meter.current,
            avg_power=meter.power
        )

        print("Zone Aggregation Completed")

        return {
            "Zone": result.zone,
            "Average Voltage": result.average_voltage,
            "Average Current": result.average_current,
            "Average Power": result.average_power
        }

    finally:
        db.close()