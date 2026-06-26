"""
Configuration for the Memory Agent.
"""

from pydantic_settings import BaseSettings


class MemoryConfig(BaseSettings):
    """Configuration for the Memory Agent Storage backend."""
    storage_backend: str = "mock"  # Options: 'mock' or 'hindsight'
    hindsight_api_key: str | None = None
    hindsight_endpoint: str | None = None


memory_settings = MemoryConfig()
