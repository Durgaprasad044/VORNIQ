"""
Core Forecasting Orchestrator Service.
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.forecast.services.scenario_service import ScenarioService
from agents.financial.forecast.services.growth_service import GrowthService
from agents.financial.forecast.services.assumption_service import AssumptionService
from agents.financial.forecast.services.trend_service import TrendService
from agents.financial.forecast.services.projection_service import ProjectionService


class ForecastService:
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.config = config or {}
        self.growth_service = GrowthService()
        self.assumption_service = AssumptionService()
        self.trend_service = TrendService()
        self.projection_service = ProjectionService(self.config.get("model", "rule_based"))
        self.scenario_service = ScenarioService(self.projection_service)

    async def generate_forecast(self, document: FinancialDocument, analysis: FinancialAnalysis) -> FinancialForecast:
        # Generate assumptions based on historical analysis and config
        assumptions = self.assumption_service.generate(analysis, self.config)
        
        # Base projections
        horizon = self.config.get("horizon_years", 3)
        base_revenue = self.projection_service.project_metric(document, "revenue", assumptions.revenue_growth_rate, horizon)
        base_expense = self.projection_service.project_metric(document, "expenses", assumptions.cost_inflation_rate, horizon)
        base_profit = self.projection_service.project_margin(base_revenue, base_expense)
        base_cash_flow = self.projection_service.project_metric(document, "cash_flow", assumptions.revenue_growth_rate, horizon)

        # Scenarios
        scenarios = self.scenario_service.generate_scenarios(document, assumptions, horizon)
        
        return FinancialForecast(
            metadata={"model_used": self.projection_service.model_name, "horizon_years": str(horizon)},
            revenue_forecast=base_revenue,
            expense_forecast=base_expense,
            profit_forecast=base_profit,
            cash_flow_forecast=base_cash_flow,
            scenarios=scenarios,
            assumptions=assumptions
        )
