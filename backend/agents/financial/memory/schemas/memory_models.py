"""
Memory Agent Data Models.
Defines the core entities stored in the generic Memory service.
"""

from datetime import datetime, timezone
from typing import Any
from pydantic import BaseModel, Field


class MemoryRecord(BaseModel):
    """Base generic memory record structure."""
    record_id: str = Field(description="Unique identifier for the memory record.")
    entity_id: str = Field(description="The business entity this memory belongs to (e.g. company ticker, user id).")
    memory_type: str = Field(description="E.g. 'metric', 'document', 'relationship', 'anomaly'.")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict, description="Flexible metadata payload.")


class MetricMemory(MemoryRecord):
    """Memory specifically tracking a KPI or financial metric."""
    metric_name: str = Field(description="Name of the metric (e.g. 'revenue').")
    value: float = Field(description="The numeric value of the metric.")
    period: str = Field(description="The financial period (e.g. '2023-Q1').")


class RelationshipMemory(MemoryRecord):
    """Memory tracking relationships between entities."""
    target_entity_id: str = Field(description="The entity this relationship points to.")
    relationship_type: str = Field(description="E.g. 'competitor', 'subsidiary', 'supplier'.")
    weight: float = Field(default=1.0, description="Strength or weight of the relationship.")
