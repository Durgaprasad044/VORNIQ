"""
Maps data into specific sections.
"""

from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.report.schemas.section_schema import ReportSection
from agents.financial.report.services.narrative_service import NarrativeService
from agents.financial.report.services.recommendation_aggregator import RecommendationAggregator


class SectionBuilder:
    def __init__(self) -> None:
        self.narrative = NarrativeService()
        self.aggregator = RecommendationAggregator()

    def build_sections(
        self, 
        enabled_sections: list[str],
        document: FinancialDocument,
        analysis: FinancialAnalysis,
        forecast: FinancialForecast,
        risk: FinancialRiskAssessment
    ) -> list[ReportSection]:
        
        sections = []
        for sec_id in enabled_sections:
            if sec_id == "executive_summary":
                content = self.narrative.generate_executive_summary(analysis, forecast)
                sections.append(ReportSection(section_id=sec_id, title="Executive Summary", content=content))
            
            elif sec_id == "financial_highlights":
                score = analysis.health_score
                sections.append(ReportSection(section_id=sec_id, title="Financial Highlights", content=f"Overall Health Score: {score}/100"))
                
            elif sec_id == "risk_assessment":
                content = f"Overall Risk Score: {risk.overall_risk_score} (Level: {risk.risk_level})\nWarnings: {len(risk.anomalies)} anomalies detected."
                sections.append(ReportSection(section_id=sec_id, title="Risk Assessment", content=content))
                
            elif sec_id == "recommendations":
                content = self.aggregator.aggregate(analysis, risk)
                sections.append(ReportSection(section_id=sec_id, title="Strategic Recommendations", content=content))
                
        return sections
