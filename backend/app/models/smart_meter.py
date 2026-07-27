"""
Smart Meter Model

Represents a smart meter device installed at a consumer location.
Tracks meter identification, zone assignment, and current load.

Adapted from Sakshi_Project for compatibility with the main project.
"""

from sqlalchemy import Column, Float, Integer, String

from database import Base


class SmartMeter(Base):
    """SQLAlchemy model for smart meter data."""

    __tablename__ = "smart_meters"

    id = Column(Integer, primary_key=True, index=True)
    meter_number = Column(String(50), unique=True, nullable=False, index=True)
    zone = Column(String(100), nullable=False, index=True)
    consumer_name = Column(String(100), nullable=False)
    current_load = Column(Float, default=0.0)
