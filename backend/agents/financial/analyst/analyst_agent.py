"""Analyst Agent Entrypoint"""

from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.analyst.services.analysis_service import AnalysisService


class FinancialAnalystAgent:
    """
    Agent 3 - Financial Analyst.
    Consumes structured financial documents and outputs a comprehensive analysis.
    """
    def __init__(self) -> None:
        self.service = AnalysisService()

    async def execute(self, document: FinancialDocument) -> FinancialAnalysis:
        """Process a financial document and return analytical insights."""
        return await self.service.analyze(document)
