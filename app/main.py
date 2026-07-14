from fastapi import FastAPI

app = FastAPI(
    title="Smart Grid Load Balancing API",
    version="1.0.0",
    description="Backend API for Smart Grid Load Balancing & Forecasting"
)

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Smart Grid API is Running 🚀"
    }