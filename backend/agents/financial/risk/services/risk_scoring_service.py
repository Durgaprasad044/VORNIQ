"""
Risk Scoring Service.
"""

from typing import Any
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.risk.schemas.anomaly_schema import Anomaly
from agents.financial.risk.schemas.risk_schema import RiskCategoryScore


class RiskScoringService:
    def calculate(
        self, 
        analysis: FinancialAnalysis, 
        anomalies: list[Anomaly], 
        stress_results: dict[str, Any], 
        config: dict[str, Any]
    ) -> tuple[list[RiskCategoryScore], float, str]:
        """Returns (category_scores, overall_score, risk_level)"""
        
        cat_scores = [
            RiskCategoryScore(
                category="Liquidity",
                score=65.0,
                level="Moderate",
                reasoning="Current ratio is slightly below benchmark."
            )
        ]
        
        overall_score = 65.0
        risk_level = "Moderate"
        
        if any(a.severity == "Critical" for a in anomalies):
            overall_score = max(overall_score, 90.0)
            risk_level = "Critical"
            
        return cat_scores, overall_score, risk_level
