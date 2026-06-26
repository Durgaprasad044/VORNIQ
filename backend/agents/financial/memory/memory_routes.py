"""
FastAPI Routes for Memory Agent
"""

from fastapi import APIRouter, Depends
from agents.financial.memory.schemas.api_contracts import (
    StoreMemoryRequest, StoreMemoryResponse,
    QueryMemoryRequest, QueryMemoryResponse,
    DeleteMemoryRequest, DeleteMemoryResponse
)
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.memory.dependencies import get_memory_service


router = APIRouter(prefix="/api/v1/memory", tags=["Memory Agent"])


@router.post("/store", response_model=StoreMemoryResponse)
async def store_memory(
    request: StoreMemoryRequest,
    service: BaseMemoryService = Depends(get_memory_service)
) -> StoreMemoryResponse:
    record_id = await service.store_memory(
        entity_id=request.entity_id,
        memory_type=request.memory_type,
        metadata=request.metadata
    )
    return StoreMemoryResponse(success=True, record_id=record_id)


@router.post("/query", response_model=QueryMemoryResponse)
async def query_memory(
    request: QueryMemoryRequest,
    service: BaseMemoryService = Depends(get_memory_service)
) -> QueryMemoryResponse:
    records = await service.retrieve_memories(
        entity_id=request.entity_id,
        memory_type=request.memory_type,
        limit=request.limit
    )
    return QueryMemoryResponse(records=records)


@router.delete("/delete", response_model=DeleteMemoryResponse)
async def delete_memory(
    request: DeleteMemoryRequest,
    service: BaseMemoryService = Depends(get_memory_service)
) -> DeleteMemoryResponse:
    success = await service.delete_memory(record_id=request.record_id)
    return DeleteMemoryResponse(success=success)
