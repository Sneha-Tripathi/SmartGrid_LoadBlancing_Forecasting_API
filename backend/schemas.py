from pydantic import BaseModel, Field
from datetime import datetime


class MeterDataCreate(BaseModel):
    voltage: float = Field(..., gt=0, lt=500)
    current: float = Field(..., gt=0, lt=100)
    power: float = Field(..., gt=0)
    frequency: float = Field(..., ge=45, le=65)


class MeterDataUpdate(BaseModel):
    voltage: float = Field(..., gt=0, lt=500)
    current: float = Field(..., gt=0, lt=100)
    power: float = Field(..., gt=0)
    frequency: float = Field(..., ge=45, le=65)


class MeterDataResponse(BaseModel):
    id: int
    timestamp: datetime
    voltage: float
    current: float
    power: float
    frequency: float

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    zone: str
    load: float
    status: str


class AlertOut(AlertBase):
    id: int

    class Config:
        from_attributes = True

class AlertCreate(BaseModel):
    zone: str
    load: float
    status: str