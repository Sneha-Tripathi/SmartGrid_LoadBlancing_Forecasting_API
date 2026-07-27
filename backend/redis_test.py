import redis

try:
    r = redis.Redis(host="localhost", port=6379, db=0)
    r.ping()
    print("Redis Connected Successfully!")
except Exception as e:
    print("Redis Connection Failed!")
    print(e)