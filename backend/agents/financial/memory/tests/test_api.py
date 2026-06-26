import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from agents.financial.memory.memory_routes import router as memory_router
from agents.financial.memory.health_routes import router as health_router

# Create a temporary FastAPI app for testing routes
app = FastAPI()
app.include_router(memory_router)
app.include_router(health_router)

client = TestClient(app)

def test_health_check() -> None:
    """Test the /health endpoint to verify the API is responsive."""
    response = client.get("/api/v1/memory/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["storage_backend"] == "mock"

def test_api_store_and_query() -> None:
    """Test the full HTTP flow: Store -> Query -> Delete."""
    
    # 1. Store
    store_payload = {
        "entity_id": "TEST_CORP",
        "memory_type": "metric",
        "metadata": {"value": 100}
    }
    store_response = client.post("/api/v1/memory/store", json=store_payload)
    assert store_response.status_code == 200
    store_data = store_response.json()
    assert store_data["success"] is True
    record_id = store_data["record_id"]
    
    # 2. Query
    query_payload = {
        "entity_id": "TEST_CORP",
        "memory_type": "metric",
        "limit": 5
    }
    query_response = client.post("/api/v1/memory/query", json=query_payload)
    assert query_response.status_code == 200
    query_data = query_response.json()
    assert len(query_data["records"]) >= 1
    assert query_data["records"][0]["record_id"] == record_id
    
    # 3. Delete
    delete_payload = {
        "record_id": record_id
    }
    delete_response = client.request("DELETE", "/api/v1/memory/delete", json=delete_payload)
    assert delete_response.status_code == 200
    assert delete_response.json()["success"] is True

def test_api_validation_error() -> None:
    """Test that FastAPI strictly returns HTTP 422 for missing Pydantic fields."""
    bad_payload = {
        "memory_type": "metric"
        # Missing 'entity_id' and 'metadata'
    }
    response = client.post("/api/v1/memory/store", json=bad_payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
