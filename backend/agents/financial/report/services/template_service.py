"""
Dynamic template loader.
"""

from typing import Any
from agents.financial.report.schemas.template_schema import ReportTemplate


class TemplateService:
    def load_template(self, report_type: str, config: dict[str, Any]) -> ReportTemplate:
        """Loads a template dynamically based on config or type without hardcoding structures."""
        
        # In production, this would read from `shared/prompts/` or a DB.
        # Stubbing dynamic mapping for demonstration.
        type_lower = report_type.lower()
        if type_lower == "executive":
            sections = ["executive_summary", "financial_highlights", "recommendations"]
        elif type_lower == "board":
            sections = ["executive_summary", "financial_highlights", "risk_assessment", "forecast", "recommendations", "appendix"]
        else:
            sections = ["executive_summary", "key_metrics"]

        return ReportTemplate(
            template_id=f"{type_lower}_v1",
            report_type=report_type,
            enabled_sections=sections,
            headers="CONFIDENTIAL - VORNIQ FINANCIAL PLATFORM",
            footers="Generated autonomously by VORNIQ Agent 6"
        )
