import pytest
from agents.shared.schemas.financial_schema import FinancialPeriodData, FinancialMetric
from agents.financial.analyst.services.kpi_service import KPIService

def test_kpi_service_valid_ratios() -> None:
    """Expected Output: Valid ratios generated correctly."""
    service = KPIService()
    period = FinancialPeriodData(
        balance_sheet={
            "current_assets": FinancialMetric(normalized=2000.0, confidence=0.9),
            "current_liabilities": FinancialMetric(normalized=1000.0, confidence=0.8)
        }
    )
    ratios = service.calculate_ratios(period)
    
    assert len(ratios) == 1
    assert ratios[0].name == "current_ratio"
    assert ratios[0].value == 2.0
    assert ratios[0].confidence == 0.8  # Should take min confidence

def test_kpi_service_division_by_zero() -> None:
    """Invalid Input: Tests division by zero handling."""
    service = KPIService()
    period = FinancialPeriodData(
        balance_sheet={
            "current_assets": FinancialMetric(normalized=2000.0, confidence=0.9),
            "current_liabilities": FinancialMetric(normalized=0.0, confidence=1.0)
        }
    )
    ratios = service.calculate_ratios(period)
    
    # Should safely skip the calculation rather than crashing
    assert len(ratios) == 0

def test_kpi_service_missing_fields() -> None:
    """Missing Fields: Gracefully handle absent metrics."""
    service = KPIService()
    period = FinancialPeriodData(
        balance_sheet={
            "current_assets": FinancialMetric(normalized=2000.0, confidence=0.9)
            # current_liabilities is missing
        }
    )
    ratios = service.calculate_ratios(period)
    
    assert len(ratios) == 0
