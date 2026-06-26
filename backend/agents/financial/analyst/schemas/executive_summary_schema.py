"""Executive summary and scoring schemas."""

from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    category: str = Field(description="Area of concern: liquidity, debt, efficiency, working_capital, costs, margin, cash_reserves, growth.")
    action: str = Field(description="Actionable recommendation text.")
    priority: str = Field(description="critical, high, medium, or low.")
    expected_impact: str | None = Field(default=None, description="Expected outcome if recommendation is followed.")
    data_support: list[str] = Field(default_factory=list, description="Metrics or ratios that support this recommendation.")


class KeyRisk(BaseModel):
    category: str = Field(description="Risk category: liquidity, solvency, operational, market, compliance.")
    description: str = Field(description="Explanation of the risk.")
    severity: str = Field(description="critical, high, medium, or low.")
    probability: str = Field(description="high, medium, or low.")


class ExecutiveSummary(BaseModel):
    overall_health: str = Field(description="One-sentence summary of overall financial health.")
    most_important_finding: str = Field(description="Single most significant insight from the analysis.")
    biggest_risk: str = Field(description="Most critical risk identified.")
    biggest_opportunity: str = Field(description="Most significant opportunity identified.")
    immediate_recommendation: str = Field(description="Single most urgent action to take.")
    confidence_level: str = Field(description="high, medium, or low based on data completeness and quality.")


class CategoryScore(BaseModel):
    category: str = Field(description="Score category: liquidity, profitability, efficiency, leverage, cash_flow, growth, working_capital, valuation.")
    score: float = Field(ge=0.0, le=100.0, description="Category score 0-100.")
    max_score: float = Field(default=100.0, ge=0.0, description="Maximum possible score for this category.")
    weight: float = Field(default=1.0, ge=0.0, description="Contribution weight to overall score.")
    reasoning: str = Field(description="Why this score was assigned.")


class HealthScore(BaseModel):
    overall_score: float = Field(ge=0.0, le=100.0, description="Aggregated business health score 0-100.")
    category_scores: list[CategoryScore] = Field(default_factory=list, description="Per-category breakdown.")
    reasoning: str = Field(description="High-level explanation of the overall score.")
