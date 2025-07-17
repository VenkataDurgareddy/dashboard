from fastapi import APIRouter
from pymongo import MongoClient
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()

client = MongoClient("mongodb://localhost:27017")
db = client["jobs_logs_db"]
logs = db["logs"]

IST_OFFSET = timedelta(hours=5, minutes=30)

@router.get("/api/requests/volume")
def get_request_volume():
    now_utc = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    now_ist = now_utc + IST_OFFSET
    start_ist = now_ist - timedelta(hours=5)

    hourly_data = []
    for i in range(6):
        ist_slot_start = start_ist + timedelta(hours=i)
        ist_slot_end = ist_slot_start + timedelta(hours=1)

        utc_slot_start = ist_slot_start - IST_OFFSET
        utc_slot_end = ist_slot_end - IST_OFFSET

        label = ist_slot_start.strftime("%H:%M")

        total_requests = logs.count_documents({
            "event": { "$in": ["job_started", "job_submitted", "job_processing_started"] },
            "timestamp": { "$gte": utc_slot_start, "$lt": utc_slot_end }
        })

        successful = logs.count_documents({
            "event": { "$in": ["job_completed", "job_processed_successfully"] },
            "timestamp": { "$gte": utc_slot_start, "$lt": utc_slot_end }
        })

        hourly_data.append({
            "time": label,
            "requests": total_requests,
            "success": successful
        })

    return { "data": hourly_data }
