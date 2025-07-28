from fastapi import APIRouter, Body
import psutil
from pymongo import MongoClient, errors
from api.config import alert_config  # Shared config

router = APIRouter()

client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=1000)

@router.get("/alerts")
def get_alerts():
    alerts = []

    memory = psutil.virtual_memory()
    if memory.percent > alert_config["memory_threshold"]:
        alerts.append({
            "title": "High Memory Usage",
            "description": f"Memory usage is at {memory.percent:.1f}%",
            "time": "Just now"
        })

    cpu = psutil.cpu_percent(interval=1)
    if cpu > alert_config["cpu_threshold"]:
        alerts.append({
            "title": "High CPU Usage",
            "description": f"CPU usage is at {cpu:.1f}%",
            "time": "Just now"
        })

    disk = psutil.disk_usage('/')
    if disk.percent > alert_config["disk_threshold"]:
        alerts.append({
            "title": "Low Disk Space",
            "description": f"Disk usage is at {disk.percent:.1f}%",
            "time": "Just now"
        })

    try:
        client.admin.command("ping")
    except errors.ServerSelectionTimeoutError as e:
        alerts.append({
            "title": "Database Connection Error",
            "description": f"MongoDB connection failed: {str(e)}",
            "time": "Just now"
        })

    return {"alerts": alerts}



@router.get("/alerts/config")
def get_alert_config():
    return alert_config



@router.post("/alerts/config")
def update_alert_config(
    memory_threshold: int = Body(...),
    cpu_threshold: int = Body(...),
    disk_threshold: int = Body(...)
):
    alert_config["memory_threshold"] = memory_threshold
    alert_config["cpu_threshold"] = cpu_threshold
    alert_config["disk_threshold"] = disk_threshold
    return {
        "message": "Configuration updated",
        "config": alert_config
    }
