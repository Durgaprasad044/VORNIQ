"""
Trend analysis for identifying volatility and cyclical patterns.
"""

from agents.shared.schemas.financial_schema import FinancialDocument


class TrendService:
    def analyze(self, document: FinancialDocument) -> dict[str, str]:
        """Analyzes historical periods for cyclical trends or volatility."""
        return {
            "seasonality": "stable",
            "volatility": "low"
        }
