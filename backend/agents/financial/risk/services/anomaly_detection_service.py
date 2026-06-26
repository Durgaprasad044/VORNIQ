"""
Anomaly Detection Service.
"""

from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.anomaly_schema import Anomaly


class AnomalyDetectionService:
    def detect(
        self, 
        document: FinancialDocument, 
        analysis: FinancialAnalysis, 
        forecast: FinancialForecast, 
        config: dict[str, Any]
    ) -> list[Anomaly]:
        anomalies = []
        
        # Check for unexpected revenue drops in the analysis trends
        for trend in analysis.trends:
            if trend.metric == "revenue" and trend.change_percent is not None and trend.change_percent < -0.20:
                anomalies.append(Anomaly(
                    title="Unexpected Revenue Drop",
                    description="Revenue dropped by more than 20% historically.",
                    metric="revenue",
                    actual_value=f"{trend.change_percent * 100:.1f}%",
                    severity="High"
                ))
        return anomalies
