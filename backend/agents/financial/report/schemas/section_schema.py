"""
Section schema for the Report Generation Agent.
"""

from pydantic import BaseModel, Field


class ReportSection(BaseModel):
    """Represents a single modular chunk of a report (e.g. Executive Summary)."""
    section_id: str = Field(description="Internal identifier (e.g. executive_summary).")
    title: str = Field(description="Display title for the section.")
    content: str = Field(description="Raw text or markdown content for the section.")
    data_payload: dict[str, str] | None = Field(default=None, description="Optional raw metrics tied to this section for JSON endpoints.")
