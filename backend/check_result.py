from celery.result import AsyncResult
from celery_app import celery

task_id = input("96290202-8fb1-483f-ba7e-7b3a92116ac0 ").strip()

result = AsyncResult(task_id, app=celery)

print("State:", result.state)

if result.ready():
    print("Result:", result.result)
else:
    print("Task is still running.")