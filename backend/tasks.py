from celery_app import celery
from database import SessionLocal
import crud


@celery.task
def calculate_load():

    db = SessionLocal()

    try:
        meter = crud.get_latest_meter_data(db)

        if meter is None:
            return {
                "status": "No Data Found"
            }

        apparent_power = meter.voltage * meter.current

        power_factor = meter.power / apparent_power if apparent_power else 0

        result = {
            "Voltage": meter.voltage,
            "Current": meter.current,
            "Power": meter.power,
            "Frequency": meter.frequency,
            "Apparent Power": round(apparent_power, 2),
            "Power Factor": round(power_factor, 2)
        }

        print(result)

        return result

    finally:
        db.close()