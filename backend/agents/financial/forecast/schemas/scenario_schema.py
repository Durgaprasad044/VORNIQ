"""
Scenario schema for the Forecast Agent (Agent 4).

Defines the models for different forecast scenarios (e.g., Base Case, Upside, Downside)
and their respective metric projections.
"""

from typing import TYPE_CHECKING
from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from .forecast_schema import MetricForecast


class ScenarioAnalysis(BaseModel):
    """
    Financial projections under a specific scenario variant.
    
    Provides isolated forecasts for key metrics based on the assumptions
    defined for this particular scenario (e.g., higher growth rate in Upside case).
    """
    scenario_name: str = Field(description="Identifier: 'base_case', 'upside_case', or 'downside_case'.")
    description: str = Field(description="Explanation of the assumptions and macro conditions driving this scenario.")
    probability_weight: float = Field(default=1.0, ge=0.0, le=1.0, description="Weighting of this scenario in blended models.")
    
    # Core scenario metrics as dictated by the architecture
    revenue: 'MetricForecast | None' = Field(default=None, description="Scenario-specific revenue projection.")
    expenses: 'MetricForecast | None' = Field(default=None, description="Scenario-specific expense projection.")
    ebitda: 'MetricForecast | None' = Field(default=None, description="Scenario-specific EBITDA projection.")
    operating_margin: 'MetricForecast | None' = Field(default=None, description="Scenario-specific operating margin projection.")
    net_profit: 'MetricForecast | None' = Field(default=None, description="Scenario-specific net profit projection.")
    cash_flow: 'MetricForecast | None' = Field(default=None, description="Scenario-specific cash flow projection.")
    growth: 'MetricForecast | None' = Field(default=None, description="Scenario-specific growth projection.")
