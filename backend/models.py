from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime


class MeterData(Base):
    __tablename__ = "meter_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    voltage = Column(Float)
    current = Column(Float)
    power = Column(Float)
    frequency = Column(Float)


class AggregatedLoad(Base):
    __tablename__ = "aggregated_load"

    id = Column(Integer, primary_key=True, index=True)

    zone = Column(String, nullable=False)

    average_voltage = Column(Float)
    average_current = Column(Float)
    average_power = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)