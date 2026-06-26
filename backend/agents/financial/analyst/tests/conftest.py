import pytest
from datetime import datetime, timezone
from agents.shared.schemas.financial_schema import FinancialDocument, DocumentMetadata, FinancialPeriodData, FinancialMetric

@pytest.fixture
def sample_financial_document() -> FinancialDocument:
    """Fixture providing a complete, valid financial document for testing."""
    return FinancialDocument(
        metadata=DocumentMetadata(
            filename="q3_report.pdf",
            file_type="pdf",
            extractor_used="PDFExtractor",
            processed_at=datetime.now(timezone.utc)
        ),
        company_name="Acme Corp",
        periods={
            "2023": FinancialPeriodData(
                balance_sheet={
                    "current_assets": FinancialMetric(normalized=50000.0, confidence=0.9),
                    "current_liabilities": FinancialMetric(normalized=25000.0, confidence=0.9)
                }
            )
        }
    )

@pytest.fixture
def empty_financial_document() -> FinancialDocument:
    """Fixture providing a document with missing period data (Edge Case)."""
    return FinancialDocument(
        metadata=DocumentMetadata(
            filename="empty.pdf",
            file_type="pdf",
            extractor_used="PDFExtractor",
        ),
        company_name="Ghost Inc",
        periods={}
    )

@pytest.fixture
def zero_liability_document() -> FinancialDocument:
    """Fixture providing a document with zero values to test division by zero handling."""
    return FinancialDocument(
        metadata=DocumentMetadata(
            filename="zero.pdf",
            file_type="pdf",
            extractor_used="PDFExtractor",
        ),
        company_name="Zero Corp",
        periods={
            "2023": FinancialPeriodData(
                balance_sheet={
                    "current_assets": FinancialMetric(normalized=50000.0, confidence=0.9),
                    "current_liabilities": FinancialMetric(normalized=0.0, confidence=1.0)
                }
            )
        }
    )
