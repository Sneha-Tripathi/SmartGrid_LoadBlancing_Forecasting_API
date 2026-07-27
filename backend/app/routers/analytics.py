from fastapi import APIRouter
import random
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)

@router.get("/today-energy")
def today_energy():
    return {"value": round(random.uniform(45.2, 68.7), 1), "unit": "MWh", "change": round(random.uniform(-3.5, 8.2), 1), "trend": "up" if random.random() > 0.4 else "down"}

@router.get("/weekly-usage")
def weekly_usage():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return [{"day": d, "usage": round(random.uniform(200, 450), 1)} for d in days]

@router.get("/monthly-usage")
def monthly_usage():
    return {"value": round(random.uniform(1200, 1900), 1), "unit": "MWh", "change": round(random.uniform(-2.0, 6.5), 1), "trend": "up" if random.random() > 0.45 else "down"}

@router.get("/prediction-accuracy")
def prediction_accuracy():
    return {"value": round(random.uniform(91.0, 99.5), 1), "unit": "%", "change": round(random.uniform(-1.0, 2.5), 1), "trend": "up" if random.random() > 0.3 else "down"}

@router.get("/carbon-saved")
def carbon_saved():
    return {"value": round(random.uniform(12.0, 28.5), 1), "unit": "tons CO2", "change": round(random.uniform(1.0, 5.0), 1), "trend": "up"}

@router.get("/ai-efficiency")
def ai_efficiency():
    return {"value": round(random.uniform(82.0, 97.0), 1), "unit": "%", "change": round(random.uniform(0.5, 3.2), 1), "trend": "up" if random.random() > 0.25 else "down"}

@router.get("/forecast/hourly")
def forecast_hourly():
    now = datetime.now()
    hours = []
    for i in range(24):
        t = (now + timedelta(hours=i)).strftime("%H:00")
        base = random.uniform(200, 420)
        hours.append({"time": t, "predicted": round(base, 1), "lower_bound": round(base - random.uniform(10, 40), 1), "upper_bound": round(base + random.uniform(10, 40), 1), "confidence": round(random.uniform(75, 99), 1)})
    return hours

@router.get("/forecast/daily")
def forecast_daily():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    result = []
    for d in days:
        base = random.uniform(280, 410)
        result.append({"day": d, "predicted": round(base, 1), "lower_bound": round(base - random.uniform(15, 45), 1), "upper_bound": round(base + random.uniform(15, 45), 1), "confidence": round(random.uniform(78, 98), 1)})
    return result

@router.get("/forecast/peak-load")
def forecast_peak_load():
    return {"predicted_peak": round(random.uniform(3.8, 6.2), 2), "unit": "MW", "expected_time": f"{random.randint(14, 18)}:00", "confidence": round(random.uniform(85, 98), 1), "current_load": round(random.uniform(2.1, 4.8), 2), "remaining_capacity": round(random.uniform(1.5, 4.0), 2)}

@router.get("/forecast/confidence")
def forecast_confidence():
    return {"overall": round(random.uniform(88, 97), 1), "hourly": round(random.uniform(82, 96), 1), "daily": round(random.uniform(85, 97), 1), "weekly": round(random.uniform(78, 93), 1), "peak_load": round(random.uniform(86, 98), 1), "model_version": "v2.4.1", "last_trained": "2025-07-20", "data_points": random.randint(12500, 18500)}

@router.get("/recommendations")
def recommendations():
    return [
        {"id": "rec-001", "type": "reduce_load", "title": "Reduce Peak Load", "description": "Shift 15% of non-critical loads to off-peak hours between 14:00-18:00 to reduce peak demand by approximately 0.8 MW.", "impact": "High", "priority": 1, "savings": "0.8 MW", "action": "Schedule load shifting", "zone": "South Zone"},
        {"id": "rec-002", "type": "switch_backup", "title": "Activate Backup Reserves", "description": "Current load approaching 85% of capacity. Recommend activating backup generators in West Zone to ensure grid stability.", "impact": "Critical", "priority": 2, "savings": "1.2 MW", "action": "Activate backup", "zone": "West Zone"},
        {"id": "rec-003", "type": "balance_zones", "title": "Rebalance Zone Distribution", "description": "North Zone at 65% capacity while South Zone at 92%. Recommend redistributing 0.5 MW from South to North for optimal balance.", "impact": "Medium", "priority": 3, "savings": "0.5 MW", "action": "Rebalance zones", "zone": "All Zones"},
        {"id": "rec-004", "type": "maintenance", "title": "Schedule Preventive Maintenance", "description": "Meter MTR-1004 has been flagged for overdue maintenance. Schedule inspection within the next 48 hours to prevent potential failure.", "impact": "Medium", "priority": 4, "savings": "Prevent 2.4 MW outage risk", "action": "Schedule maintenance", "zone": "West Zone"},
    ]
