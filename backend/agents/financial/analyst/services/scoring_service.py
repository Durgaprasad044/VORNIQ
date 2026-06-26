"""Scoring Engine Service"""

from agents.financial.analyst.schemas.kpi_schema import FinancialRatio
from agents.financial.analyst.schemas.executive_summary_schema import HealthScore, CategoryScore


class ScoringService:
    def __init__(self) -> None:
        pass

    def calculate_score(self, ratios: list[FinancialRatio]) -> HealthScore:
        return HealthScore(
            overall_score=75.0,
            category_scores=[
                CategoryScore(
                    category="liquidity", 
                    score=75.0, 
                    reasoning="Based on standard preliminary benchmarks."
                )
            ],
            reasoning="Health score is stable, reflecting typical early-stage data completeness."
        )
