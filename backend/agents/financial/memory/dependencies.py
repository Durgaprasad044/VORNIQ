"""
Dependency Injection Container for the Memory Agent.
"""

from agents.financial.memory.config import memory_settings
from agents.financial.memory.repositories.base_repository import MemoryRepository
from agents.financial.memory.repositories.mock_repository import MockMemoryRepository
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.memory.services.memory_service import MemoryService

# Global state for the mock repository to persist during app lifecycle
_mock_repo = MockMemoryRepository()


def get_memory_repository() -> MemoryRepository:
    """Dependency injection factory for the repository layer."""
    if memory_settings.storage_backend == "hindsight":
        raise NotImplementedError("Hindsight integration is pending.")
    
    return _mock_repo


def get_memory_service() -> BaseMemoryService:
    """Dependency injection factory for the service layer."""
    repo = get_memory_repository()
    return MemoryService(repo)
