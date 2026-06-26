"""
Assumptions schema for the Forecast Agent.
Defines macro and micro economic assumptions driving the forecasting models.
"""

from pydantic import BaseModel, Field


class ForecastAssumptions(BaseModel):
    revenue_growth_rate: float = Field(description="Assumed annual revenue growth rate (decimal).")
    cost_inflation_rate: float = Field(description="Assumed annual cost inflation rate (decimal).")
    hiring_growth_rate: float = Field(default=0.0, description="Assumed increase in hiring/headcount costs.")
    capital_expenditure_rate: float = Field(default=0.0, description="Assumed CapEx as a percentage of revenue.")
    debt_interest_rate: float = Field(default=0.0, description="Assumed interest rate on new debt.")
    tax_rate: float = Field(description="Assumed effective tax rate (decimal).")
    currency_inflation: float = Field(default=0.0, description="Macro currency inflation rate.")
    
    # Base scenario overrides
    upside_multiplier: float = Field(default=1.2, description="Multiplier for growth in the upside scenario.")
    downside_multiplier: float = Field(default=0.8, description="Multiplier for growth in the downside scenario.")
