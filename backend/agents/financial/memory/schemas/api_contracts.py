"""
API Contracts for the Memory Agent.
"""

from typing import Any
from pydantic import BaseModel
from agents.financial.memory.schemas.memory_models import MemoryRecord


class StoreMemoryRequest(BaseModel):
    entity_id: str
    memory_type: str
    metadata: dict[str, Any]


class StoreMemoryResponse(BaseModel):
    success: bool
    record_id: str


class QueryMemoryRequest(BaseModel):
    entity_id: str
    memory_type: str | None = None
    limit: int = 10


class QueryMemoryResponse(BaseModel):
    records: list[MemoryRecord]


class DeleteMemoryRequest(BaseModel):
    record_id: str


class DeleteMemoryResponse(BaseModel):
    success: bool
