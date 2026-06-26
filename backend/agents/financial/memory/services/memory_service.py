"""
Concrete Memory Service implementing the business logic.
"""

import uuid
from typing import Any
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.memory.repositories.base_repository import MemoryRepository
from agents.financial.memory.schemas.memory_models import MemoryRecord


class MemoryService(BaseMemoryService):
    """Concrete business logic layer using injected repository."""
    
    def __init__(self, repository: MemoryRepository) -> None:
        self.repository = repository

    async def store_memory(self, entity_id: str, memory_type: str, metadata: dict[str, Any]) -> str:
        record = MemoryRecord(
            record_id=str(uuid.uuid4()),
            entity_id=entity_id,
            memory_type=memory_type,
            metadata=metadata
        )
        return await self.repository.save(record)

    async def retrieve_memories(self, entity_id: str, memory_type: str | None = None, limit: int = 10) -> list[MemoryRecord]:
        return await self.repository.query(entity_id, memory_type, limit)

    async def delete_memory(self, record_id: str) -> bool:
        return await self.repository.delete(record_id)
