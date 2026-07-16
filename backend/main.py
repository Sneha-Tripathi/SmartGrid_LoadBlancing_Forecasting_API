from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException

import crud
import schemas
from database import SessionLocal

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Smart Grid API Running"}


@app.post("/meter-data", response_model=schemas.MeterDataResponse)
def create_data(
    data: schemas.MeterDataCreate,
    db: Session = Depends(get_db)
):
    return crud.create_meter_data(db, data)


@app.get("/meter-data")
def get_data(db: Session = Depends(get_db)):
    return crud.get_all_meter_data(db)

@app.get("/meter-data/{meter_id}", response_model=schemas.MeterDataResponse)
def get_single_data(meter_id: int, db: Session = Depends(get_db)):
    meter = crud.get_meter_data_by_id(db, meter_id)

    if meter is None:
        raise HTTPException(status_code=404, detail="Record not found")

    return meter

@app.put("/meter-data/{meter_id}", response_model=schemas.MeterDataResponse)
def update_data(
    meter_id: int,
    data: schemas.MeterDataUpdate,
    db: Session = Depends(get_db)
):
    meter = crud.update_meter_data(db, meter_id, data)

    if meter is None:
        raise HTTPException(status_code=404, detail="Record not found")

    return meter

@app.delete("/meter-data/{meter_id}")
def delete_data(meter_id: int, db: Session = Depends(get_db)):
    meter = crud.delete_meter_data(db, meter_id)

    if meter is None:
        raise HTTPException(status_code=404, detail="Record not found")

    return {"message": "Record deleted successfully"}