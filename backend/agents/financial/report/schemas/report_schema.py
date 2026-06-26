"""
Root schema for the Report Generation Agent (Agent 6).
"""

from datetime import datetime, timezone
from pydantic import BaseModel, Field
from agents.financial.report.schemas.section_schema import ReportSection


class ReportMetadata(BaseModel):
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    report_type: str = Field(description="e.g. Executive, Board, Investor")
    report_version: str = Field(default="1.0")
    source_agents: list[str] = Field(description="Agents that provided data")
    confidence_score: float = Field(description="Overall confidence in the report data.")
    processing_time_ms: int = Field(default=0)


class FinancialReport(BaseModel):
    """The final assembled report output."""
    metadata: ReportMetadata
    sections: list[ReportSection] = Field(description="Ordered sections of the report.")
    formatted_content: dict[str, str] = Field(description="Pre-rendered formats mapped by type (e.g. 'markdown', 'html', 'json').")
    warnings: list[str] = Field(default_factory=list, description="Warnings regarding missing data during rendering.")
