# routers/system.py

from fastapi import APIRouter
import psutil
import GPUtil

router = APIRouter()

@router.get("/system-resources")
def get_system_resources():
    # Fetch GPU usage (0 if no GPU)
    gpus = GPUtil.getGPUs()
    gpu_usage = gpus[0].load * 100 if gpus else 0

    return {
        "cpu": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory().percent,
        "gpu": round(gpu_usage, 2),
        "disk": psutil.disk_usage('/').percent
    }
