from tasks import test_task

result = test_task.delay()

print("Task Sent Successfully!")
print("Task ID:", result.id)