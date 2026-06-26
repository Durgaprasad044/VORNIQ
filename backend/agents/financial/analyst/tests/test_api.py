from fastapi.testclient import TestClient
from fastapi import FastAPI
from agents.financial.analyst.analyst_routes import router
from agents.shared.schemas.financial_schema import FinancialDocument

# Setup FastAPI test app
app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_analyze_endpoint_valid_payload(sample_financial_document: FinancialDocument) -> None:
    """Integration Test: Valid API request returns structured analysis."""
    payload = sample_financial_document.model_dump(mode="json")
    response = client.post("/api/v1/analyst/analyze", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "ratios" in data
    assert "executive_summary" in data
    assert "health_score" in data
    
    assert len(data["ratios"]) == 1
    assert data["ratios"][0]["value"] == 2.0

def test_analyze_endpoint_empty_document(empty_financial_document: FinancialDocument) -> None:
    """Integration Test / Edge Case: Request with no financial periods."""
    payload = empty_financial_document.model_dump(mode="json")
    response = client.post("/api/v1/analyst/analyze", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Ratios should be empty, but execution must not fail
    assert len(data["ratios"]) == 0
    assert data["executive_summary"]["overall_health"] != ""

def test_analyze_endpoint_invalid_payload() -> None:
    """Invalid Input: Test API handling of malformed schemas."""
    response = client.post("/api/v1/analyst/analyze", json={"metadata": "missing_required_fields"})
    
    assert response.status_code == 422  # Unprocessable Entity
