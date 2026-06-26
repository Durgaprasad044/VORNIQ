"""KPI schemas for ratio calculations and trend analysis."""

from pydantic import BaseModel, Field


class FinancialRatio(BaseModel):
    name: str = Field(description="Canonical KPI name (e.g. current_ratio, gross_margin).")
    value: float | None = Field(default=None, description="Computed numeric value.")
    category: str = Field(description="Ratio category: liquidity, profitability, etc.")
    interpretation: str | None = Field(default=None, description="Human-readable explanation of what this value means.")
    benchmark: float | None = Field(default=None, description="Optional industry benchmark for comparison.")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Confidence in this ratio calculation (0.0-1.0).")
    warning: str | None = Field(default=None, description="Warning if data was incomplete or unreliable.")


class TrendPoint(BaseModel):
    period: str = Field(description="Period identifier, e.g. '2023', 'Q2_2024'.")
    value: float = Field(description="Metric value at this period.")


class MetricTrend(BaseModel):
    metric: str = Field(description="Metric key, e.g. 'revenue', 'net_income'.")
    points: list[TrendPoint] = Field(default_factory=list, description="Chronological data points.")
    change_percent: float | None = Field(default=None, description="Percentage change over the full range.")
    direction: str | None = Field(default=None, description="increasing, decreasing, stable, or volatile.")
