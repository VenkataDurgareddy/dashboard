# routers/model.py

from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/model-performance")
def get_model_performance():
    # You can replace this with actual performance stats from ML services or logs
    models = [
        {
            "name": "Face Detection",
            "accuracy": round(random.uniform(98.5, 99.5), 2),
            "latency": f"{random.randint(40, 60)}ms"
        },
        {
            "name": "Face Recognition",
            "accuracy": round(random.uniform(97.0, 99.0), 2),
            "latency": f"{random.randint(100, 140)}ms"
        },
        {
            "name": "Liveness Detection",
            "accuracy": round(random.uniform(96.5, 98.5), 2),
            "latency": f"{random.randint(80, 100)}ms"
        },
        {
            "name": "Quality Assessment",
            "accuracy": round(random.uniform(95.0, 97.0), 2),
            "latency": f"{random.randint(30, 45)}ms"
        }
    ]
    return {"models": models}
