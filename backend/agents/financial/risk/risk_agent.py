"""
Entrypoint for the Risk Assessment Agent (Agent 5).
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.risk.services.risk_service import RiskService


class FinancialRiskAssessmentAgent:
    """
    Agent 5 - Financial Risk Assessment.
    Consumes outputs from Parser, Analyst, and Forecast agents to generate risk assessments.
    """
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.service = RiskService(config)

    async def execute(
        self, 
        document: FinancialDocument, 
        analysis: FinancialAnalysis, 
        forecast: FinancialForecast
    ) -> FinancialRiskAssessment:
        """Evaluate financial threats and produce a risk assessment report."""
        return await self.service.assess_risk(document, analysis, forecast)
