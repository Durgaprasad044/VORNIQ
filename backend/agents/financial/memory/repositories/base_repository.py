"""
Abstract base repository for Memory Storage.
"""

from abc import ABC, abstractmethod
from agents.financial.memory.schemas.memory_models import MemoryRecord


class MemoryRepository(ABC):
    """Abstract base class defining the contract for memory storage."""
    
    @abstractmethod
    async def save(self, record: MemoryRecord) -> str:
        """Saves a memory record and returns its ID."""
        pass
        
    @abstractmethod
    async def query(self, entity_id: str, memory_type: str | None = None, limit: int = 10) -> list[MemoryRecord]:
        """Queries memory records for an entity."""
        pass
        
    @abstractmethod
    async def delete(self, record_id: str) -> bool:
        """Deletes a memory record."""
        pass
