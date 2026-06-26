"""
Template schema for the Report Generation Agent.
"""

from pydantic import BaseModel, Field


class ReportTemplate(BaseModel):
    """Configuration defining the structure and formatting of a specific report type."""
    template_id: str = Field(description="Unique identifier (e.g. executive_summary_v1).")
    report_type: str = Field(description="The type of report (e.g. Executive, Board, Investor).")
    enabled_sections: list[str] = Field(description="List of section IDs to include, in order.")
    formatting_styles: dict[str, str] = Field(default_factory=dict, description="Style mapping (e.g. font, branding colors).")
    headers: str | None = Field(default=None, description="Global header text or markdown.")
    footers: str | None = Field(default=None, description="Global footer text or markdown.")
