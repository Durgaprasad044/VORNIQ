"""
Root schema for the Risk Assessment Agent (Agent 5).
"""

from datetime import datetime, timezone
from pydantic import BaseModel, Field

from agents.financial.risk.schemas.anomaly_schema import Anomaly
from agents.financial.risk.schemas.mitigation_schema import MitigationStrategy


class RiskCategoryScore(BaseModel):
    category: str = Field(description="Risk category (e.g. Liquidity, Solvency).")
    score: float = Field(description="0-100 score where higher means more risk.")
    level: str = Field(description="Low, Moderate, High, Critical")
    reasoning: str = Field(description="Explanation for the assigned score.")


class IdentifiedRisk(BaseModel):
    name: str = Field(description="Name of the specific risk.")
    category: str = Field(description="Risk category.")
    severity: str = Field(description="Severity (Low, Moderate, High, Critical).")
    likelihood: str = Field(description="Likelihood (Low, Moderate, High, Critical).")
    business_impact: str = Field(description="Potential impact on the business.")


class FinancialRiskAssessment(BaseModel):
    """Root model for Agent 5 output."""
    overall_risk_score: float = Field(description="Aggregated risk score (0-100).")
    risk_level: str = Field(description="Overall risk level (Low, Moderate, High, Critical).")
    category_scores: list[RiskCategoryScore] = Field(default_factory=list)
    top_risks: list[IdentifiedRisk] = Field(default_factory=list)
    anomalies: list[Anomaly] = Field(default_factory=list)
    mitigations: list[MitigationStrategy] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    confidence_score: float = Field(default=1.0, description="0.0 to 1.0 confidence in the assessment.")
    processed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
