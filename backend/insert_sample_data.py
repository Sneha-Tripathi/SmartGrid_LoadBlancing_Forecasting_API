from database import SessionLocal
from models import MeterData
from datetime import datetime

db = SessionLocal()

sample = MeterData(
    timestamp=datetime.now(),
    voltage=230.5,
    current=5.8,
    power=1336.9,
    frequency=50.0
)

db.add(sample)
db.commit()

print("Sample Data Inserted Successfully!")

db.close()