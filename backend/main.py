from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import SessionLocal

app = FastAPI(
    title="Smart Grid Load Balancing API",
    description="API for managing Smart Meter Data",
    version="1.0.0"
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return {"message": "Smart Grid API Running"}


@app.post(
    "/meter-data",
    response_model=schemas.MeterDataResponse,
    status_code=status.HTTP_201_CREATED
)
def create_data(
    data: schemas.MeterDataCreate,
    db: Session = Depends(get_db)
):
    return crud.create_meter_data(db, data)


@app.get(
    "/meter-data",
    response_model=list[schemas.MeterDataResponse],
    status_code=status.HTTP_200_OK
)
def get_data(db: Session = Depends(get_db)):
    return crud.get_all_meter_data(db)


@app.get(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse,
    status_code=status.HTTP_200_OK
)
def get_single_data(meter_id: int, db: Session = Depends(get_db)):
    meter = crud.get_meter_data_by_id(db, meter_id)

    if meter is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )

    return meter


@app.put(
    "/meter-data/{meter_id}",
    response_model=schemas.MeterDataResponse,
    status_code=status.HTTP_200_OK
)
def update_data(
    meter_id: int,
    data: schemas.MeterDataUpdate,
    db: Session = Depends(get_db)
):
    meter = crud.update_meter_data(db, meter_id, data)

    if meter is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )

    return meter


@app.delete(
    "/meter-data/{meter_id}",
    status_code=status.HTTP_200_OK
)
def delete_data(meter_id: int, db: Session = Depends(get_db)):
    meter = crud.delete_meter_data(db, meter_id)

    if meter is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )

    return {"message": "Record deleted successfully"}