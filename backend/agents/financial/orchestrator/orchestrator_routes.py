"""
API Routes for the Backend Orchestrator.
"""

from fastapi import APIRouter, Depends
from agents.financial.orchestrator.schemas import UnifiedPipelineRequest, UnifiedPipelineResponse
from agents.financial.orchestrator.orchestrator_service import OrchestratorService

# Dependencies
from agents.financial.parser.parser_agent import ParserAgent
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.analyst.analyst_agent import FinancialAnalystAgent
from agents.financial.forecast.forecast_agent import ForecastAgent
from agents.financial.risk.risk_agent import FinancialRiskAssessmentAgent
from agents.financial.report.report_agent import FinancialReportGenerationAgent

from dependencies import (
    get_parser_agent, get_memory_service, get_analyst_agent,
    get_forecast_agent, get_risk_agent, get_report_agent
)

router = APIRouter(prefix="/api/v1/orchestrator", tags=["Orchestrator"])


def get_orchestrator_service(
    parser: ParserAgent = Depends(get_parser_agent),
    memory: BaseMemoryService = Depends(get_memory_service),
    analyst: FinancialAnalystAgent = Depends(get_analyst_agent),
    forecast: ForecastAgent = Depends(get_forecast_agent),
    risk: FinancialRiskAssessmentAgent = Depends(get_risk_agent),
    report: FinancialReportGenerationAgent = Depends(get_report_agent)
) -> OrchestratorService:
    return OrchestratorService(parser, memory, analyst, forecast, risk, report)


@router.post("/analyze", response_model=UnifiedPipelineResponse)
async def execute_pipeline(
    request: UnifiedPipelineRequest,
    service: OrchestratorService = Depends(get_orchestrator_service)
) -> UnifiedPipelineResponse:
    """Executes the complete financial intelligence pipeline."""
    return await service.run_pipeline(request)


@router.get("/health")
async def orchestrator_health() -> dict[str, str]:
    return {"status": "ok", "service": "orchestrator"}
