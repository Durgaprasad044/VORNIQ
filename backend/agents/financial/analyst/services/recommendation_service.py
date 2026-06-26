"""Recommendation Service"""

from agents.financial.analyst.schemas.kpi_schema import FinancialRatio
from agents.financial.analyst.schemas.executive_summary_schema import Recommendation


class RecommendationService:
    def __init__(self) -> None:
        pass

    def generate(self, ratios: list[FinancialRatio]) -> list[Recommendation]:
        recs = []
        for r in ratios:
            if r.name == "current_ratio" and r.value is not None and r.value < 1.0:
                recs.append(Recommendation(
                    category="liquidity",
                    action="Improve liquidity by extending payables, liquidating slow-moving inventory, or raising cash.",
                    priority="high",
                    data_support=[r.name]
                ))
        return recs
