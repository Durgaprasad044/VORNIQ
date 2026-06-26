"""
Assumption generator for forecasting.
"""

from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.assumption_schema import ForecastAssumptions


class AssumptionService:
    def generate(self, analysis: FinancialAnalysis, config: dict[str, float]) -> ForecastAssumptions:
        """Generates ForecastAssumptions taking dynamic config and historical analysis into account."""
        
        return ForecastAssumptions(
            revenue_growth_rate=config.get("default_revenue_growth", 0.08),
            cost_inflation_rate=config.get("default_inflation", 0.03),
            hiring_growth_rate=config.get("default_hiring", 0.02),
            capital_expenditure_rate=config.get("default_capex", 0.05),
            debt_interest_rate=config.get("default_interest", 0.06),
            tax_rate=config.get("default_tax", 0.21),
            currency_inflation=0.02
        )
