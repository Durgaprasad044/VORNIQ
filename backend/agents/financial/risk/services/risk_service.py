"""
Orchestration service for the Risk Agent.
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment, IdentifiedRisk
from agents.financial.risk.services.anomaly_detection_service import AnomalyDetectionService
from agents.financial.risk.services.stress_test_service import StressTestService
from agents.financial.risk.services.risk_scoring_service import RiskScoringService
from agents.financial.risk.services.mitigation_service import MitigationService
from agents.financial.risk.services.recommendation_service import RecommendationService


class RiskService:
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.config = config or {}
        self.anomaly_detector = AnomalyDetectionService()
        self.stress_tester = StressTestService()
        self.scorer = RiskScoringService()
        self.mitigation = MitigationService()
        self.recommendations = RecommendationService()

    async def assess_risk(
        self, 
        document: FinancialDocument, 
        analysis: FinancialAnalysis, 
        forecast: FinancialForecast
    ) -> FinancialRiskAssessment:
        
        # 1. Detect Anomalies
        anomalies = self.anomaly_detector.detect(document, analysis, forecast, self.config)
        
        # 2. Run Stress Tests
        stress_results = self.stress_tester.run_tests(document, forecast, self.config)
        
        # 3. Score Risks
        category_scores, overall_score, risk_level = self.scorer.calculate(analysis, anomalies, stress_results, self.config)
        
        # 4. Identify Top Risks
        top_risks = [
            IdentifiedRisk(
                name="Liquidity Crunch",
                category="Liquidity",
                severity="High",
                likelihood="Moderate",
                business_impact="Inability to meet short-term obligations."
            )
        ]
        
        # 5. Generate Mitigations
        mitigations = self.mitigation.generate_mitigations(top_risks, self.config)
        
        return FinancialRiskAssessment(
            overall_risk_score=overall_score,
            risk_level=risk_level,
            category_scores=category_scores,
            top_risks=top_risks,
            anomalies=anomalies,
            mitigations=mitigations,
            warnings=[],
            confidence_score=0.95
        )
