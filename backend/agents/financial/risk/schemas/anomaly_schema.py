"""
Anomaly schema for the Risk Assessment Agent.
"""

from pydantic import BaseModel, Field


class Anomaly(BaseModel):
    """Detected anomaly, warning signal, or financial red flag."""
    title: str = Field(description="Short description of the anomaly.")
    description: str = Field(description="Detailed explanation of the detected anomaly.")
    metric: str = Field(description="The financial metric or ratio involved.")
    expected_value_range: str | None = Field(default=None, description="Expected normal range.")
    actual_value: str | None = Field(default=None, description="The actual anomalous value.")
    severity: str = Field(description="Severity of the anomaly (Low, Moderate, High, Critical).")
