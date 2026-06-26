"""FastAPI Routes for Analyst Agent"""

from fastapi import APIRouter
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.analyst.analyst_agent import FinancialAnalystAgent


router = APIRouter(prefix="/api/v1/analyst", tags=["Analyst Agent"])
agent = FinancialAnalystAgent()


@router.post("/analyze", response_model=FinancialAnalysis)
async def analyze_financials(document: FinancialDocument) -> FinancialAnalysis:
    """Run full financial analysis on a structured FinancialDocument."""
    return await agent.execute(document)

@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "analyst_agent"}
