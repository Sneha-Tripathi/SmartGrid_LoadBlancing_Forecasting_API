from pydantic import BaseModel
from datetime import datetime


class MeterDataCreate(BaseModel):
    voltage: float
    current: float
    power: float
    frequency: float



class MeterDataUpdate(BaseModel):
    voltage: float
    current: float
    power: float
    frequency: float


class MeterDataResponse(BaseModel):
    id: int
    timestamp: datetime
    voltage: float
    current: float
    power: float
    frequency: float

    class Config:
        from_attributes = True