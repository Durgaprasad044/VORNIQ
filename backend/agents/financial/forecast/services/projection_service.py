"""
Mathematical projection engine with pluggable models.
"""

import datetime
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.forecast.schemas.forecast_schema import MetricForecast


class ProjectionService:
    def __init__(self, model_name: str = "rule_based") -> None:
        self.model_name = model_name

    def project_metric(self, document: FinancialDocument, metric_name: str, growth_rate: float, horizon_years: int) -> MetricForecast:
        """Projects a metric into the future using the selected model."""
        # Pluggable architecture stub: here we'd route to LinearRegression, XGBoost, Prophet, etc.
        # Defaulting to rule-based compound growth for initial implementation phase.
        
        current_year = datetime.datetime.now().year
        # Mock base value in a real scenario this comes from `document.periods`
        base_value = 1000000.0 
        
        projections = {}
        current_val = base_value
        for i in range(1, horizon_years + 1):
            current_val = current_val * (1 + growth_rate)
            projections[str(current_year + i)] = current_val
            
        return MetricForecast(
            metric_name=metric_name,
            projected_values=projections,
            confidence_interval=(current_val * 0.9, current_val * 1.1),
            growth_rate=growth_rate
        )

    def project_margin(self, revenue: MetricForecast, expense: MetricForecast) -> MetricForecast:
        """Projects a margin metric based on two other metrics (e.g., Profit = Revenue - Expense)."""
        projections = {}
        for year in revenue.projected_values:
            rev = revenue.projected_values[year]
            exp = expense.projected_values.get(year, 0.0)
            projections[year] = rev - exp
            
        return MetricForecast(
            metric_name="profit",
            projected_values=projections,
            growth_rate=0.0
        )
