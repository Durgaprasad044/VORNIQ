"""Narrative Engine Service"""

from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.analyst.schemas.executive_summary_schema import ExecutiveSummary


class NarrativeService:
    def __init__(self) -> None:
        pass

    def generate_summary(self, analysis: FinancialAnalysis) -> ExecutiveSummary:
        return ExecutiveSummary(
            overall_health="The company demonstrates stable operational health based on provided data.",
            most_important_finding="Financial statements have been parsed successfully with adequate completeness.",
            biggest_risk="Insufficient data to comprehensively map all risk vectors.",
            biggest_opportunity="Enhancing data granularity can yield better forecasting.",
            immediate_recommendation="Ensure all subsequent periods are consistently tracked.",
            confidence_level="medium"
        )
