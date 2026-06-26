"""
Entrypoint for the Report Generation Agent (Agent 6).
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.report.schemas.report_schema import FinancialReport
from agents.financial.report.services.report_service import ReportService


class FinancialReportGenerationAgent:
    """
    Agent 6 - Financial Report Generation.
    Consumes outputs from all previous agents and formats them into professional business reports.
    Does not run analytical or forecasting logic.
    """
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.service = ReportService(config)

    async def execute(
        self, 
        document: FinancialDocument, 
        analysis: FinancialAnalysis, 
        forecast: FinancialForecast,
        risk: FinancialRiskAssessment,
        report_type: str = "Executive"
    ) -> FinancialReport:
        """Compile a finalized report spanning multiple independent formats."""
        return await self.service.generate_report(document, analysis, forecast, risk, report_type)
