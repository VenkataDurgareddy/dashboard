from fastapi import APIRouter
import socket

router = APIRouter()

def is_port_open(host: str, port: int) -> bool:
    try:
        with socket.create_connection((host, port), timeout=2):
            return True
    except Exception:
        return False

@router.get("/service-status")
def get_service_status():
    services = [
        # {"name": "API Gateway", "host": "localhost", "port": 8000},
        # {"name": "Face Detection", "host": "localhost", "port": 6000},
        # {"name": "Feature Extraction", "host": "localhost", "port": 6001},
        {"name": "Database", "host": "localhost", "port": 27017},
        {"name": "Redis Cache", "host": "localhost", "port": 6379},
        # {"name": "Message Queue", "host": "localhost", "port": 9092},
    ]

    result = []
    for svc in services:
        status = "Healthy" if is_port_open(svc["host"], svc["port"]) else "Warning"
        result.append({
            "name": svc["name"],
            "status": status
        })

    return {"services": result}
