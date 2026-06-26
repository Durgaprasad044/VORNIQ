import pytest
from datetime import datetime, timezone
from agents.financial.forecast.services.projection_service import ProjectionService
from agents.shared.schemas.financial_schema import FinancialDocument, DocumentMetadata


def test_projection_service_compound_growth() -> None:
    """Test the rule-based compound growth projection logic."""
    service = ProjectionService("rule_based")
    doc = FinancialDocument(
        metadata=DocumentMetadata(
            filename="test.pdf", 
            file_type="pdf", 
            extractor_used="TestExtractor",
            processed_at=datetime.now(timezone.utc)
        ),
        periods={}
    )
    
    # Project 1M at 10% for 3 years
    forecast = service.project_metric(doc, "revenue", 0.10, 3)
    
    assert len(forecast.projected_values) == 3
    
    first_year_key = list(forecast.projected_values.keys())[0]
    # Year 1 = 1,000,000 * 1.10 = 1,100,000
    assert forecast.projected_values[first_year_key] == 1100000.0
