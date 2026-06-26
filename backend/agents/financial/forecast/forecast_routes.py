"""
FastAPI Routes for Forecast Agent
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.forecast.forecast_agent import ForecastAgent


router = APIRouter(prefix="/api/v1/forecast", tags=["Forecast Agent"])
agent = ForecastAgent()


class ForecastRequest(BaseModel):
    document: FinancialDocument
    analysis: FinancialAnalysis


@router.post("/generate", response_model=FinancialForecast)
async def generate_forecast(request: ForecastRequest) -> FinancialForecast:
    """Run full financial forecast generation."""
    return await agent.execute(request.document, request.analysis)

@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "forecast_agent"}
