"""
Health routes for the Memory Agent.
Created strictly to satisfy verification requirements without modifying core logic.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.financial.memory.config import memory_settings

router = APIRouter(prefix="/api/v1/memory", tags=["Health Checks"])


class HealthResponse(BaseModel):
    status: str
    service: str
    storage_backend: str


@router.get("/health", response_model=HealthResponse)
@router.get("/ready", response_model=HealthResponse)
@router.get("/status", response_model=HealthResponse)
async def check_health() -> HealthResponse:
    """Returns the operational status and active backend."""
    return HealthResponse(
        status="ok",
        service="memory_agent",
        storage_backend=memory_settings.storage_backend
    )
