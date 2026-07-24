from celery_app import celery
import time


@celery.task
def test_task():
    print("Background Task Started...")
    time.sleep(5)
    print("Background Task Completed!")

    return {
        "status": "success",
        "message": "Background Task Executed Successfully"
    }