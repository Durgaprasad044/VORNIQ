"""
Schemas for the Backend Orchestrator.
Defines the Unified Pipeline Request and Response contracts.
"""

from typing import Any
from pydantic import BaseModel, Field

# We import the root schemas from the shared directory to avoid coupling to specific agents.
from agents.shared.schemas.financial_schema import FinancialDocument

# Since the orchestrator integrates the pipeline, it uses the specific agent output schemas.
# Note: These are purely Pydantic models. We are NOT importing business logic.
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.report.schemas.report_schema import FinancialReport


class UnifiedPipelineRequest(BaseModel):
    """
    The initial payload to trigger the full 6-stage pipeline.
    In a real scenario, this might contain raw text, a file reference, or a pre-parsed document.
    """
    raw_text: str | None = Field(default=None, description="Raw financial text to be parsed.")
    company_ticker: str = Field(description="The entity identifier (e.g. AAPL)")
    report_type: str = Field(default="Executive", description="The type of final report requested.")


class PipelineMetadata(BaseModel):
    """Execution metrics for the pipeline."""
    total_processing_time_ms: int
    status: str = Field(description="e.g. success, partial_failure, error")
    failed_stage: str | None = None
    warnings: list[str] = Field(default_factory=list)


class UnifiedPipelineResponse(BaseModel):
    """
    The master response object aggregating the outputs from all 6 agents.
    """
    metadata: PipelineMetadata
    parsed_document: FinancialDocument | None = None
    memory_record_ids: list[str] = Field(default_factory=list, description="IDs of context stored in the Memory Agent.")
    analysis: FinancialAnalysis | None = None
    forecast: FinancialForecast | None = None
    risk_assessment: FinancialRiskAssessment | None = None
    final_report: FinancialReport | None = None
