"""
Stress Testing Service.
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast


class StressTestService:
    def run_tests(
        self, 
        document: FinancialDocument, 
        forecast: FinancialForecast, 
        config: dict[str, Any]
    ) -> dict[str, Any]:
        """Runs configurable stress scenarios and returns the impacts."""
        
        # In a real implementation, parameters are drawn from `config`
        return {
            "revenue_drop_30_pct": {"survival_months": 6, "impact": "Critical"},
            "interest_rate_spike_2_pct": {"survival_months": 12, "impact": "Moderate"}
        }
