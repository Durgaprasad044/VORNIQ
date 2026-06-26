import pytest
from agents.financial.memory.repositories.mock_repository import MockMemoryRepository
from agents.financial.memory.services.memory_service import MemoryService


@pytest.mark.asyncio
async def test_memory_service_full_lifecycle() -> None:
    """Verifies that the MemoryService successfully coordinates Store, Search, Retrieve, and Delete with the MockRepository."""
    repo = MockMemoryRepository()
    service = MemoryService(repo)
    
    # 1. Store
    record_id_1 = await service.store_memory("AAPL", "metric", {"revenue": 1000})
    record_id_2 = await service.store_memory("AAPL", "document", {"title": "Q1 Report"})
    record_id_3 = await service.store_memory("MSFT", "metric", {"revenue": 2000})
    
    assert record_id_1 is not None
    assert record_id_2 is not None
    
    # 2. Retrieve (All for AAPL)
    records = await service.retrieve_memories("AAPL")
    assert len(records) == 2
    
    # 3. Search (Filter by memory_type)
    metric_records = await service.retrieve_memories("AAPL", memory_type="metric")
    assert len(metric_records) == 1
    assert metric_records[0].record_id == record_id_1
    assert metric_records[0].metadata["revenue"] == 1000
    
    # 4. Delete
    delete_success = await service.delete_memory(record_id_1)
    assert delete_success is True
    
    # 5. Verify Deletion
    records_after_delete = await service.retrieve_memories("AAPL")
    assert len(records_after_delete) == 1
    assert records_after_delete[0].record_id == record_id_2
    
    # 6. Delete invalid record
    delete_fail = await service.delete_memory("invalid_id")
    assert delete_fail is False
