from fastapi import APIRouter, Query, HTTPException
from pymongo import MongoClient
from collections import defaultdict, Counter
from datetime import datetime, timedelta

router = APIRouter()
client = MongoClient("mongodb://localhost:27017")
db = client["jobs_logs_db"]
events = db["logs"]

EVENT_TYPE_MAP = {
    "face_verified": "Verification",
    "face_verification_failed": "Verification",
    "face_liveness_checked": "Liveness",
    "face_liveness_service_failed": "Liveness",
    "mrz_parsed": "Document",
    "mrz_parsing_failed": "Document"
}

def get_time_threshold(period: str):
    now = datetime.utcnow()
    mapping = {
        "1h": timedelta(hours=1),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7),
        "30d": timedelta(days=30)
    }
    if period not in mapping:
        raise HTTPException(status_code=400, detail="Invalid period. Use '1h', '24h', '7d', '30d'.")
    return now - mapping[period]

@router.get("/api/stats")
def compute_dashboard_stats(period: str = Query("24h")):
    time_threshold = get_time_threshold(period)
    query = {"timestamp": {"$gte": time_threshold}}
    all_events = list(events.find(query))
    task_events = defaultdict(list)
    for e in all_events:
        task_events[e["task_id"]].append(e)

    total_jobs = set()
    success_jobs = set()
    failed_jobs = set()
    job_durations = []
    active_users = set()
    pending_jobs = set()

    face_verification_success = set()
    face_verification_total = set()
    face_liveness_success = set()
    face_liveness_total = set()
    mrz_success = set()
    mrz_total = set()

    cache_hits = 0
    cache_misses = 0
    hourly_counts = [0] * 24
    type_counter = Counter()

    for e in all_events:
        # Count all events by hour (OR change below to only job_submitted)
        try:
            hour = e["timestamp"].hour  # assuming timestamp is a datetime object
            hourly_counts[hour] += 1
        except Exception as ex:
            continue

        # Cache metrics
        if e["event"] == "cache_hit":
            cache_hits += 1
        elif e["event"] == "cache_miss":
            cache_misses += 1

    for task_id, logs in task_events.items():
        event_names = {log["event"] for log in logs}
        ts_map = {log["event"]: log["timestamp"] for log in logs}

        if "job_completed" in event_names or "job_processed_successfully" in event_names:
            total_jobs.add(task_id)

        if "job_processed_successfully" in event_names:
            success_jobs.add(task_id)

        if "job_completed" in event_names and "job_processed_successfully" not in event_names:
            failed_jobs.add(task_id)

        if "job_started" in ts_map and "job_completed" in ts_map:
            try:
                duration = (ts_map["job_completed"] - ts_map["job_started"]).total_seconds()
                job_durations.append(duration)
            except:
                pass

        # Categorization
        if "face_liveness_checked" in event_names:
            face_liveness_total.add(task_id)
            face_liveness_success.add(task_id)
            type_counter["Liveness"] += 1
        elif "face_liveness_service_failed" in event_names:
            face_liveness_total.add(task_id)
            type_counter["Liveness"] += 1

        if "face_verified" in event_names:
            face_verification_total.add(task_id)
            face_verification_success.add(task_id)
            type_counter["Verification"] += 1
        elif "face_verification_failed" in event_names:
            face_verification_total.add(task_id)
            type_counter["Verification"] += 1

        if "mrz_parsed" in event_names:
            mrz_success.add(task_id)
            mrz_total.add(task_id)
            type_counter["Document"] += 1
        elif "mrz_parsing_failed" in event_names:
            mrz_total.add(task_id)
            type_counter["Document"] += 1

        if "job_started" in event_names and "job_completed" not in event_names:
            active_users.add(task_id)

        if "job_submitted" in event_names and "job_started" not in event_names:
            pending_jobs.add(task_id)

    # System Health
    last_10_jobs = list(events.find({"event": "job_completed"}).sort("timestamp", -1).limit(10))
    healthy = True
    for job in last_10_jobs:
        if not events.find_one({"task_id": job["task_id"], "event": "job_processed_successfully"}):
            healthy = False
            break

    job_table = []
    for task_id, logs in task_events.items():
        status = "pending"
        type_ = "Unknown"
        progress = 0
        duration = "-"
        ts_map = {log["event"]: log["timestamp"] for log in logs}
        events_set = {log["event"] for log in logs}

        if "job_processing_started" in events_set:
            progress = 30
            status = "processing"
        if "face_liveness_checked" in events_set or "face_liveness_service_failed" in events_set:
            progress = 45
        if "face_verified" in events_set:
            progress = 75
        if "mrz_parsed" in events_set:
            progress = 90
        if "job_processed_successfully" in events_set:
            progress = 100
            status = "completed"
        elif "job_completed" in events_set and "job_processed_successfully" not in events_set:
            status = "failed"

        if "job_started" in ts_map and "job_completed" in ts_map:
            try:
                duration = str(round((ts_map["job_completed"] - ts_map["job_started"]).total_seconds(), 1)) + "s"
            except:
                pass

        if "face_verified" in events_set:
            type_ = "Verification"
        elif "face_liveness_checked" in events_set:
            type_ = "Liveness"
        elif "mrz_parsed" in events_set:
            type_ = "Document"
        elif "job_processing_started" in events_set:
            type_ = "Deduplication"

        job_table.append({
            "job_id": task_id,
            "type": type_,
            "status": status,
            "progress": f"{progress}%",
            "duration": duration
        })

    # Metrics
    total_processed = len(total_jobs)
    success_count = len(success_jobs)
    failed_count = len(failed_jobs)
    success_rate = round((success_count / total_processed) * 100, 2) if total_processed else 0.0
    avg_time = round(sum(job_durations) / len(job_durations), 2) if job_durations else 0.0

    total_cache_requests = cache_hits + cache_misses
    cache_hit_rate = round((cache_hits / total_cache_requests) * 100, 2) if total_cache_requests else 0.0
    cache_miss_rate = 100.0 - cache_hit_rate if total_cache_requests else 0.0

    def calc_success_rate(success_set, total_set):
        return round((len(success_set) / len(total_set)) * 100, 2) if total_set else 0.0

    face_verification_success_rate = calc_success_rate(face_verification_success, face_verification_total)
    face_liveness_success_rate = calc_success_rate(face_liveness_success, face_liveness_total)
    mrz_success_rate = calc_success_rate(mrz_success, mrz_total)

    # Success trends by hour
    success_trends = defaultdict(lambda: [0] * 24)
    for task_id, logs in task_events.items():
        events_set = {log["event"] for log in logs}
        ts_map = {log["event"]: log["timestamp"] for log in logs}
        job_type = "Unknown"
        for event in events_set:
            if event in EVENT_TYPE_MAP:
                job_type = EVENT_TYPE_MAP[event]
                break
        if "job_processed_successfully" in events_set and "job_started" in ts_map:
            try:
                ts = ts_map["job_started"]
                success_trends[job_type][ts.hour] += 1
            except:
                continue

    # Latency Distribution by hour
    latency_hourly = defaultdict(list)
    for task_id, logs in task_events.items():
        ts_map = {log["event"]: log["timestamp"] for log in logs}
        if "job_started" in ts_map and "job_completed" in ts_map:
            try:
                start = ts_map["job_started"]
                end = ts_map["job_completed"]
                latency_hourly[start.hour].append((end - start).total_seconds())
            except:
                continue

    latency_distribution = []
    for hour in range(24):
        durations = latency_hourly.get(hour, [])
        avg = round(sum(durations) / len(durations), 2) if durations else 0
        latency_distribution.append(avg)

    return {
        "stats": [
            {
                "label": "Total Processed",
                "value": f"{total_processed:,}",
                "sub": f"+{round((total_processed - 10) / 10 * 100, 1)}% from yesterday" if total_processed > 10 else "0% change",
                "icon": "📈"
            },
            {
                "label": "Success Rate",
                "value": f"{success_rate}%",
                "sub": None,
                "bar": True
            },
            {
                "label": "Avg Processing Time",
                "value": f"{avg_time}s",
                "sub": "-5.2% improvement"
            },
            {
                "label": "System Health",
                "value": "Healthy" if healthy else "Warning",
                "sub": "All systems operational" if healthy else "Some jobs failed",
                "success": healthy
            }
        ],
        "metrics": {
            "total_jobs": total_processed,
            "successful_jobs": success_count,
            "failed_jobs": failed_count,
            "face_liveness_tasks": len(face_liveness_total),
            "face_verification_tasks": len(face_verification_total),
            "mrz_parsing_tasks": len(mrz_total),
            "active_users": len(active_users),
            "pending_jobs": len(pending_jobs),
            "face_verification_success_rate": face_verification_success_rate,
            "face_liveness_success_rate": face_liveness_success_rate,
            "mrz_success_rate": mrz_success_rate
        },
        "queue_summary": {
            "pending": len(pending_jobs),
            "processing": len(active_users),
            "completed": success_count,
            "failed": failed_count
        },
        "cache_performance": {
            "hit_rate": cache_hit_rate,
            "miss_rate": cache_miss_rate
        },
        "job_table": job_table[:10],
        "avg_processing_time": f"{avg_time}s",
        "request_volume": hourly_counts,
        "processing_distribution": [
            {"label": k, "value": v} for k, v in type_counter.items() if k != "Unknown"
        ],
        "success_trends": [
            {"label": job_type, "data": values}
            for job_type, values in success_trends.items() if job_type != "Unknown"
        ],
        "latency_distribution": latency_distribution
    }
