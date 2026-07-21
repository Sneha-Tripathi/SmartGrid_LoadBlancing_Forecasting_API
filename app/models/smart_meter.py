from sqlalchemy import Column, Float, Integer, String

from app.db.base import Base


class SmartMeter(Base):
    __tablename__ = "smart_meters"

    id = Column(Integer, primary_key=True, index=True)
    meter_number = Column(String(50), unique=True, nullable=False)
    zone = Column(String(100), nullable=False)
    consumer_name = Column(String(100), nullable=False)
    current_load = Column(Float, default=0.0)