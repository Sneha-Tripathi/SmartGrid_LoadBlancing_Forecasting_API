from pydantic import BaseModel


class SmartMeterBase(BaseModel):
    meter_number: str
    zone: str
    consumer_name: str
    current_load: float


class SmartMeterCreate(SmartMeterBase):
    pass


class SmartMeterResponse(SmartMeterBase):
    id: int

    model_config = {
        "from_attributes": True
    }