from database import engine, Base
from models import MeterData

print("Creating Tables...")

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")