"""KPI Calculation Service"""

from agents.shared.schemas.financial_schema import FinancialPeriodData
from agents.financial.analyst.schemas.kpi_schema import FinancialRatio


class KPIService:
    def __init__(self) -> None:
        pass

    def calculate_ratios(self, period_data: FinancialPeriodData) -> list[FinancialRatio]:
        ratios = []
        
        # Current Ratio Example (Dynamic configs should be loaded here in production)
        current_assets = period_data.balance_sheet.get("current_assets")
        current_liabilities = period_data.balance_sheet.get("current_liabilities")
        
        if (
            current_assets and current_assets.normalized is not None 
            and current_liabilities and current_liabilities.normalized is not None
            and current_liabilities.normalized != 0
        ):
            value = current_assets.normalized / current_liabilities.normalized
            ratios.append(FinancialRatio(
                name="current_ratio",
                value=value,
                category="liquidity",
                interpretation=f"The company has {value:.2f} times current assets to cover its short-term liabilities.",
                confidence=min(current_assets.confidence, current_liabilities.confidence)
            ))
            
        return ratios
