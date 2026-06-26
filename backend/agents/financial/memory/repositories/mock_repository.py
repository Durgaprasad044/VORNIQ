"""
Mock Implementation of the MemoryRepository.
"""

from agents.financial.memory.repositories.base_repository import MemoryRepository
from agents.financial.memory.schemas.memory_models import MemoryRecord


class MockMemoryRepository(MemoryRepository):
    """In-memory dictionary implementation for testing without Hindsight/Persistence."""
    
    def __init__(self) -> None:
        self._storage: dict[str, MemoryRecord] = {}

    async def save(self, record: MemoryRecord) -> str:
        self._storage[record.record_id] = record
        return record.record_id

    async def query(self, entity_id: str, memory_type: str | None = None, limit: int = 10) -> list[MemoryRecord]:
        results = []
        for record in self._storage.values():
            if record.entity_id == entity_id:
                if memory_type is None or record.memory_type == memory_type:
                    results.append(record)
        
        # Sort by timestamp descending
        results.sort(key=lambda x: x.timestamp, reverse=True)
        return results[:limit]

    async def delete(self, record_id: str) -> bool:
        if record_id in self._storage:
            del self._storage[record_id]
            return True
        return False
