from tasks import aggregate_zone_load

result = aggregate_zone_load.delay()

print("Task Sent Successfully!")
print("Task ID:", result.id)