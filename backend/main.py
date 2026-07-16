from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

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