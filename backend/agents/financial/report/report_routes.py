"""
FastAPI Routes for Report Generation Agent
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.report.schemas.report_schema import FinancialReport
from agents.financial.report.report_agent import FinancialReportGenerationAgent


router = APIRouter(prefix="/api/v1/report", tags=["Report Generation Agent"])
agent = FinancialReportGenerationAgent()


class ReportRequest(BaseModel):
    document: FinancialDocument
    analysis: FinancialAnalysis
    forecast: FinancialForecast
    risk: FinancialRiskAssessment
    report_type: str = "Executive"


@router.post("/generate", response_model=FinancialReport)
async def generate_report(request: ReportRequest) -> FinancialReport:
    """Run full report assembly."""
    return await agent.execute(
        request.document, 
        request.analysis, 
        request.forecast, 
        request.risk,
        request.report_type
    )

@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "report_agent"}
