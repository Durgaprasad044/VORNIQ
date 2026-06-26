"""
Root schema for the Financial Analyst Agent.

This module defines the main `FinancialAnalysis` model returned by the analyst agent.
"""

from datetime import datetime, timezone
from pydantic import BaseModel, Field

from .executive_summary_schema import ExecutiveSummary, KeyRisk, Recommendation, HealthScore
from .kpi_schema import FinancialRatio, MetricTrend


class CompanyHealth(BaseModel):
    """Qualitative assessment of company's financial health."""
    strengths: list[str] = Field(default_factory=list, description="Identified financial strengths.")
    weaknesses: list[str] = Field(default_factory=list, description="Identified financial weaknesses.")
    opportunities: list[str] = Field(default_factory=list, description="Strategic opportunities.")
    warnings: list[str] = Field(default_factory=list, description="Warnings or cautionary notes.")


class ScenarioAssumptions(BaseModel):
    """Assumptions generated for the downstream Forecast Agent."""
    revenue_growth: float | None = Field(default=None, description="Projected annual revenue growth rate (decimal).")
    expense_growth: float | None = Field(default=None, description="Projected annual expense growth rate (decimal).")
    capex_trend: str | None = Field(default=None, description="increasing, stable, or decreasing.")
    hiring_trend: str | None = Field(default=None, description="expanding, stable, or contracting.")
    operating_margin_trend: str | None = Field(default=None, description="improving, stable, or declining.")
    interest_rate_assumption: float | None = Field(default=None, description="Assumed interest rate for new debt (decimal).")
    tax_rate_assumption: float | None = Field(default=None, description="Assumed effective tax rate (decimal).")


class FinancialAnalysis(BaseModel):
    """
    Root model for all financial analysis outputs.
    
    Consumed by Forecast, Risk, Report, and Memory agents.
    """
    metadata: dict[str, str] = Field(
        default_factory=dict,
        description="Analysis metadata: agent_version, processing_time, company_name, period_count.",
    )
    executive_summary: ExecutiveSummary | None = Field(default=None, description="Concise executive summary.")
    company_health: CompanyHealth | None = Field(default=None, description="Strengths, weaknesses, opportunities, warnings.")
    health_score: HealthScore | None = Field(default=None, description="Configurable business health score with category breakdown.")
    ratios: list[FinancialRatio] = Field(default_factory=list, description="All computed financial ratios.")
    trends: list[MetricTrend] = Field(default_factory=list, description="Trend analysis for key metrics.")
    risks: list[KeyRisk] = Field(default_factory=list, description="Key risks identified.")
    recommendations: list[Recommendation] = Field(default_factory=list, description="Data-supported recommendations.")
    scenario_assumptions: ScenarioAssumptions | None = Field(default=None, description="Assumptions for downstream Forecast Agent.")
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0, description="Overall confidence in the analysis (0.0-1.0).")
    processed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="UTC timestamp of analysis completion.")
