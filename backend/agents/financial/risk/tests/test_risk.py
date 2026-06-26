import pytest
from unittest.mock import Mock
from agents.financial.risk.services.anomaly_detection_service import AnomalyDetectionService


def test_anomaly_detection_revenue_drop() -> None:
    """Tests if unexpected revenue drops trigger a High severity anomaly."""
    detector = AnomalyDetectionService()
    
    analysis_mock = Mock()
    trend_mock = Mock()
    trend_mock.metric = "revenue"
    trend_mock.change_percent = -0.25  # 25% drop
    analysis_mock.trends = [trend_mock]
    
    anomalies = detector.detect(Mock(), analysis_mock, Mock(), {})
    
    assert len(anomalies) == 1
    assert anomalies[0].metric == "revenue"
    assert anomalies[0].severity == "High"
    assert anomalies[0].actual_value == "-25.0%"
