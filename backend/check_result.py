from celery.result import AsyncResult
from celery_app import celery

task_id = input("Enter Task ID: ").strip()

result = AsyncResult(task_id, app=celery)

print("State:", result.state)

if result.ready():
    print("Result:", result.result)
else:
    print("Task is still running.")