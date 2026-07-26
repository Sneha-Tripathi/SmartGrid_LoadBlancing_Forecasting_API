from celery import Celery

celery = Celery(
    "smart_grid",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["tasks"]
)

celery.conf.timezone = "Asia/Kolkata"

celery.conf.beat_schedule = {
    "calculate-load-every-5-minutes": {
        "task": "tasks.calculate_load",
        "schedule": 300.0,   # 300 sec = 5 minutes
    },
}