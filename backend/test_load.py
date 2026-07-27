from tasks import calculate_load

result = calculate_load.delay()

print("Task Sent Successfully!")
print("Task ID:", result.id)