from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import routers from API modules
from api.statcard import router as stats_router
from api.alert import router as alert_router
from api.system_usage import router as system_router
from api.service_status import router as service_router
from api.model_performance import router as model_performance_router
from api.api_counter import increment_call, get_call_stats
from api.api_stats import router as api_stat_router
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"]
)
@app.middleware("http")
async def count_api_calls(request: Request, call_next):
    response = await call_next(request)
    # Track specific endpoints
    path = request.url.path
    if path in [
        "/alerts",
        "/model-performance",
        "/service-status",
        "/system-resources"
    ]:
        increment_call(path)
    return response
# Include routers
app.include_router(stats_router)
app.include_router(alert_router)
app.include_router(system_router)
app.include_router(service_router)
app.include_router(model_performance_router)
app.include_router(api_stat_router)
# Main entry
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
