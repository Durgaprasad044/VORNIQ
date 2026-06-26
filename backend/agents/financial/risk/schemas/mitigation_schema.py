"""
Mitigation schema for the Risk Assessment Agent.
"""

from pydantic import BaseModel, Field


class MitigationAction(BaseModel):
    action: str = Field(description="Actionable mitigation step.")
    effort: str = Field(description="Estimated effort (Low, Medium, High).")
    expected_impact: str = Field(description="What this action will resolve.")


class MitigationStrategy(BaseModel):
    risk_name: str = Field(description="The name of the risk this strategy addresses.")
    category: str = Field(description="Risk category.")
    actions: list[MitigationAction] = Field(default_factory=list)
