import json
from pymongo import MongoClient

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')  
db = client['jobs_logs_db']
collection = db['logs']

# Load data from JSON file
with open('job_logs_100.json') as file:
    job_logs = json.load(file)

# Optional: Clean collection before insert
collection.delete_many({})

# Insert into MongoDB
collection.insert_many(job_logs)

print(f"Inserted {len(job_logs)} job logs into MongoDB!")
