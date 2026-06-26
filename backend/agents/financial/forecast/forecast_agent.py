"""
Entrypoint for the Forecast Agent (Agent 4).
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.forecast.services.forecast_service import ForecastService


class ForecastAgent:
    """
    Agent 4 - Forecast Agent.
    Consumes FinancialDocument and FinancialAnalysis to produce structured FinancialForecasts.
    """
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.service = ForecastService(config)

    async def execute(self, document: FinancialDocument, analysis: FinancialAnalysis) -> FinancialForecast:
        """Process financial history and analysis to generate future projections."""
        return await self.service.generate_forecast(document, analysis)
