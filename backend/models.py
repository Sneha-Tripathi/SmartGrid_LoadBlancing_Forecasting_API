from sqlalchemy import Column, Integer, Float, DateTime
from database import Base
from datetime import datetime


class MeterData(Base):
    __tablename__ = "meter_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    voltage = Column(Float, nullable=False)
    current = Column(Float, nullable=False)
    power = Column(Float, nullable=False)
    frequency = Column(Float, nullable=False)