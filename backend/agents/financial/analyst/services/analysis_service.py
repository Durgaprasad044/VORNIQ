"""Analysis Orchestration Service"""

from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.analyst.services.kpi_service import KPIService
from agents.financial.analyst.services.scoring_service import ScoringService
from agents.financial.analyst.services.recommendation_service import RecommendationService
from agents.financial.analyst.services.narrative_service import NarrativeService


class AnalysisService:
    def __init__(self) -> None:
        self.kpi_service = KPIService()
        self.scoring = ScoringService()
        self.recommendations = RecommendationService()
        self.narrative = NarrativeService()

    async def analyze(self, doc: FinancialDocument) -> FinancialAnalysis:
        analysis = FinancialAnalysis()
        
        # For this skeleton, we analyze the most recent period if available
        if doc.periods:
            latest_period_key = list(doc.periods.keys())[-1]
            latest_period = doc.periods[latest_period_key]
            
            analysis.ratios = self.kpi_service.calculate_ratios(latest_period)
            analysis.health_score = self.scoring.calculate_score(analysis.ratios)
            analysis.recommendations = self.recommendations.generate(analysis.ratios)
            
        analysis.executive_summary = self.narrative.generate_summary(analysis)
        return analysis
