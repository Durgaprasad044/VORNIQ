"""
Report generation orchestrator.
"""

import time
from typing import Any
from agents.shared.schemas.financial_schema import FinancialDocument
from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.forecast.schemas.forecast_schema import FinancialForecast
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment
from agents.financial.report.schemas.report_schema import FinancialReport, ReportMetadata
from agents.financial.report.services.template_service import TemplateService
from agents.financial.report.services.section_builder import SectionBuilder
from agents.financial.report.services.formatting_service import FormattingService


class ReportService:
    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.config = config or {}
        self.template_service = TemplateService()
        self.section_builder = SectionBuilder()
        self.formatting_service = FormattingService()

    async def generate_report(
        self,
        document: FinancialDocument,
        analysis: FinancialAnalysis,
        forecast: FinancialForecast,
        risk: FinancialRiskAssessment,
        report_type: str = "Executive"
    ) -> FinancialReport:
        start_time = time.time()
        
        # 1. Load template configurations
        template = self.template_service.load_template(report_type, self.config)
        
        # 2. Extract and compile modular sections
        sections = self.section_builder.build_sections(
            template.enabled_sections, 
            document, analysis, forecast, risk
        )
        
        # 3. Apply independent formatting engines
        formatted_content = {
            "markdown": self.formatting_service.build_markdown(sections, template),
            "html": self.formatting_service.build_html(sections, template),
            "json": self.formatting_service.build_json(sections, template)
        }
        
        # 4. Generate Metadata
        # Guard against zero lists to calculate the correct min confidence
        confidences = [analysis.confidence_score, forecast.confidence_score, risk.confidence_score]
        lowest_confidence = min(confidences) if confidences else 1.0
        
        metadata = ReportMetadata(
            report_type=report_type,
            source_agents=["parser", "analyst", "forecast", "risk"],
            confidence_score=lowest_confidence,
            processing_time_ms=int((time.time() - start_time) * 1000)
        )
        
        return FinancialReport(
            metadata=metadata,
            sections=sections,
            formatted_content=formatted_content,
            warnings=[]
        )
