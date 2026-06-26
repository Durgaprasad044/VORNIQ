"""
FastAPI Routes for Risk Assessment Agent
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.risk.risk_agent import FinancialRiskAssessmentAgent


router = APIRouter(prefix="/api/v1/risk", tags=["Risk Assessment Agent"])
agent = FinancialRiskAssessmentAgent()


class RiskRequest(BaseModel):
    document: FinancialDocument
    analysis: FinancialAnalysis
    forecast: FinancialForecast


@router.post("/assess", response_model=FinancialRiskAssessment)
async def assess_risk(request: RiskRequest) -> FinancialRiskAssessment:
    """Run full financial risk assessment."""
    return await agent.execute(request.document, request.analysis, request.forecast)

@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "risk_agent"}
