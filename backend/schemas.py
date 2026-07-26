from pydantic import BaseModel, Field
from datetime import datetime


class MeterDataCreate(BaseModel):
    """
    Schema for creating a new meter data record.

    Provides voltage, current, power, and frequency readings
    with validation constraints for the Smart Grid system.
    """
    voltage: float = Field(
        ...,
        gt=0,
        lt=500,
        description="Voltage reading in volts (0 < V < 500)",
        examples=[230.5],
    )
    current: float = Field(
        ...,
        gt=0,
        lt=100,
        description="Current reading in amperes (0 < A < 100)",
        examples=[5.8],
    )
    power: float = Field(
        ...,
        gt=0,
        description="Power reading in watts (> 0)",
        examples=[1336.9],
    )
    frequency: float = Field(
        ...,
        ge=45,
        le=65,
        description="Frequency reading in Hz (45 <= Hz <= 65)",
        examples=[50.0],
    )


class MeterDataUpdate(BaseModel):
    """
    Schema for updating an existing meter data record.

    All fields are required with the same validation constraints
    as the create schema.
    """
    voltage: float = Field(
        ...,
        gt=0,
        lt=500,
        description="Voltage reading in volts (0 < V < 500)",
        examples=[240.0],
    )
    current: float = Field(
        ...,
        gt=0,
        lt=100,
        description="Current reading in amperes (0 < A < 100)",
        examples=[6.2],
    )
    power: float = Field(
        ...,
        gt=0,
        description="Power reading in watts (> 0)",
        examples=[1488.0],
    )
    frequency: float = Field(
        ...,
        ge=45,
        le=65,
        description="Frequency reading in Hz (45 <= Hz <= 65)",
        examples=[50.1],
    )


class MeterDataResponse(BaseModel):
    """
    Schema for returning meter data records in API responses.

    Includes the auto-generated ID, timestamp, and all readings.
    """
    id: int = Field(description="Unique identifier for the meter data record")
    timestamp: datetime = Field(description="Timestamp when the record was created")
    voltage: float = Field(description="Voltage reading in volts")
    current: float = Field(description="Current reading in amperes")
    power: float = Field(description="Power reading in watts")
    frequency: float = Field(description="Frequency reading in Hz")

    class Config:
        from_attributes = True


class AlertBase(BaseModel):
    """
    Base schema for alert data.

    Contains the zone identifier, load value, and status classification.
    """
    zone: str = Field(
        ...,
        description="Zone identifier where the alert was triggered",
        examples=["Zone A"],
    )
    load: float = Field(
        ...,
        description="Power load value that triggered the alert",
        examples=[1336.9],
    )
    status: str = Field(
        ...,
        description="Alert status: NORMAL, WARNING, or CRITICAL",
        examples=["WARNING"],
    )


class AlertOut(AlertBase):
    """
    Schema for returning alert records in API responses.

    Includes the auto-generated ID and all base alert fields.
    """
    id: int = Field(description="Unique identifier for the alert record")

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    """
    Schema for creating a new alert record.

    Requires zone, load, and status fields.
    """
    zone: str = Field(
        ...,
        description="Zone identifier where the alert was triggered",
        examples=["Zone B"],
    )
    load: float = Field(
        ...,
        description="Power load value that triggered the alert",
        examples=[1150.0],
    )
    status: str = Field(
        ...,
        description="Alert status: NORMAL, WARNING, or CRITICAL",
        examples=["CRITICAL"],
    )
