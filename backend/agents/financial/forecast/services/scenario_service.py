"""
Scenario generation service (Base, Upside, Downside).
"""

from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.forecast.schemas.assumption_schema import ForecastAssumptions
from agents.financial.forecast.schemas.scenario_schema import ScenarioAnalysis
from agents.financial.forecast.services.projection_service import ProjectionService


class ScenarioService:
    def __init__(self, projection_service: ProjectionService) -> None:
        self.projection_service = projection_service

    def generate_scenarios(self, document: FinancialDocument, assumptions: ForecastAssumptions, horizon: int) -> dict[str, ScenarioAnalysis]:
        scenarios = {}
        
        # Upside
        upside_growth = assumptions.revenue_growth_rate * assumptions.upside_multiplier
        upside_expense = assumptions.cost_inflation_rate * 0.95 # slightly better cost control
        
        upside_revenue = self.projection_service.project_metric(document, "revenue", upside_growth, horizon)
        upside_expenses = self.projection_service.project_metric(document, "expenses", upside_expense, horizon)
        
        scenarios["upside_case"] = ScenarioAnalysis(
            scenario_name="upside_case",
            description="Aggressive growth with optimized costs.",
            revenue=upside_revenue,
            expenses=upside_expenses
        )
        
        # Downside
        downside_growth = assumptions.revenue_growth_rate * assumptions.downside_multiplier
        downside_expense = assumptions.cost_inflation_rate * 1.05 # worse cost control
        
        downside_revenue = self.projection_service.project_metric(document, "revenue", downside_growth, horizon)
        downside_expenses = self.projection_service.project_metric(document, "expenses", downside_expense, horizon)
        
        scenarios["downside_case"] = ScenarioAnalysis(
            scenario_name="downside_case",
            description="Conservative growth with higher inflation.",
            revenue=downside_revenue,
            expenses=downside_expenses
        )
        
        # Base case
        scenarios["base_case"] = ScenarioAnalysis(
            scenario_name="base_case",
            description="Expected baseline trajectory.",
            revenue=self.projection_service.project_metric(document, "revenue", assumptions.revenue_growth_rate, horizon),
            expenses=self.projection_service.project_metric(document, "expenses", assumptions.cost_inflation_rate, horizon)
        )
        
        return scenarios
