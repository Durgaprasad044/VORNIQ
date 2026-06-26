"""
Abstract base service for Memory Business Logic.
"""

from abc import ABC, abstractmethod
from typing import Any
from agents.financial.memory.schemas.memory_models import MemoryRecord


class BaseMemoryService(ABC):
    """Abstract base class for the business logic layer of memory."""
    
    @abstractmethod
    async def store_memory(self, entity_id: str, memory_type: str, metadata: dict[str, Any]) -> str:
        """Stores a new memory and returns its ID."""
        pass

    @abstractmethod
    async def retrieve_memories(self, entity_id: str, memory_type: str | None = None, limit: int = 10) -> list[MemoryRecord]:
        """Retrieves memories for a given entity."""
        pass

    @abstractmethod
    async def delete_memory(self, record_id: str) -> bool:
        """Deletes a specific memory record by ID."""
        pass
