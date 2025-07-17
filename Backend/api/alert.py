from fastapi import APIRouter
import psutil
from pymongo import MongoClient, errors
from datetime import datetime

router = APIRouter()

# MongoDB Client
client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=1000)  # 1s timeout

@router.get("/alerts")
def get_alerts():
    alerts = []

    # ✅ Memory Usage Alert
    memory = psutil.virtual_memory()
    if memory.percent > 0:
        alerts.append({
            "title": "High Memory Usage",
            "description": f"Memory usage is at {memory.percent:.1f}%",
            "time": "Just now"
        })

    # ✅ CPU Usage Alert
    cpu = psutil.cpu_percent(interval=1)
    if cpu > 0:
        alerts.append({
            "title": "High CPU Usage",
            "description": f"CPU usage is at {cpu:.1f}%",
            "time": "Just now"
        })

    # ✅ Disk Usage Alert
    disk = psutil.disk_usage('/')
    if disk.percent > 0:
        alerts.append({
            "title": "Low Disk Space",
            "description": f"Disk usage is at {disk.percent:.1f}%",
            "time": "Just now"
        })

    # ✅ MongoDB Health Check
    try:
        client.admin.command("ping")
    except errors.ServerSelectionTimeoutError as e:
        alerts.append({
            "title": "Database Connection Error",
            "description": f"MongoDB connection failed: {str(e)}",
            "time": "Just now"
        })
    except Exception as e:
        alerts.append({
            "title": "Database Unknown Error",
            "description": str(e),
            "time": "Just now"
        })

    return {"alerts": alerts}
