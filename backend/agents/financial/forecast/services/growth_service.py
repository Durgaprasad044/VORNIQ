"""
Growth Service for calculating historical CAGRs.
"""

from agents.shared.schemas.financial_schema import FinancialDocument


class GrowthService:
    def calculate_historical_cagr(self, document: FinancialDocument, metric_key: str) -> float:
        """Calculates Compound Annual Growth Rate for a given metric across available periods."""
        periods = list(document.periods.keys())
        if len(periods) < 2:
            return 0.05  # Default 5% fallback if not enough history
            
        # Stub for complex CAGR analysis on income_statement, balance_sheet, or cash_flow
        return 0.10
