# api/statcard.py

from fastapi import APIRouter
from api.api_counter import get_call_stats

router = APIRouter()

@router.get("/api-call-stats")
def api_call_stats():
    stats = get_call_stats()
    return {"apis": [{"path": k, "count": v} for k, v in stats.items()]}
