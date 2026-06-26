"""
Entrypoint orchestrator for the Memory Agent.
"""

from typing import Any
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.memory.dependencies import get_memory_service


class MemoryAgent:
    """
    Agent 7 - Memory Orchestrator.
    Manages long-term storage and retrieval of financial data using injected services.
    """
    def __init__(self, service: BaseMemoryService | None = None) -> None:
        self.service = service or get_memory_service()

    async def store(self, entity_id: str, memory_type: str, metadata: dict[str, Any]) -> str:
        return await self.service.store_memory(entity_id, memory_type, metadata)

    async def recall(self, entity_id: str, memory_type: str | None = None) -> list[Any]:
        return await self.service.retrieve_memories(entity_id, memory_type)
