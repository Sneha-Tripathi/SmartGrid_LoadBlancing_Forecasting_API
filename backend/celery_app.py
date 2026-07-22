from celery import Celery

celery = Celery(
    "smart_grid",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)


celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True
)


# register tasks
import tasks