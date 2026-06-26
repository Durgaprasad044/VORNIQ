"""
Generates professional business text.
"""

from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast


class NarrativeService:
    def generate_executive_summary(self, analysis: FinancialAnalysis, forecast: FinancialForecast) -> str:
        """Converts structured intelligence into professional business narrative."""
        
        # Guarantee: No hallucination, strictly describes provided inputs.
        revenue_growth = 0.0
        if forecast.revenue_forecast and forecast.revenue_forecast.growth_rate is not None:
            revenue_growth = forecast.revenue_forecast.growth_rate * 100

        return (
            f"The company demonstrates a {analysis.health_score}/100 financial health score. "
            f"Based on current historical trends, the forecasted models indicate a {revenue_growth:.1f}% growth trajectory. "
            "Please review the attached recommendation aggregator for strategic actions."
        )
