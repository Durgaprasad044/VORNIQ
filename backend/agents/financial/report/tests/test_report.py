import pytest
from agents.financial.report.schemas.section_schema import ReportSection
from agents.financial.report.schemas.template_schema import ReportTemplate
from agents.financial.report.services.formatting_service import FormattingService


def test_markdown_formatter() -> None:
    """Verifies the FormattingService successfully renders Markdown chunks."""
    formatter = FormattingService()
    template = ReportTemplate(
        template_id="test",
        report_type="test",
        enabled_sections=[],
        headers="CONFIDENTIAL"
    )
    section = ReportSection(section_id="exec", title="Executive", content="Test content.")
    
    md = formatter.build_markdown([section], template)
    
    assert "CONFIDENTIAL" in md
    assert "# Executive" in md
    assert "Test content." in md


def test_html_formatter() -> None:
    """Verifies the FormattingService successfully renders HTML structures."""
    formatter = FormattingService()
    template = ReportTemplate(
        template_id="test",
        report_type="test",
        enabled_sections=[]
    )
    section = ReportSection(section_id="exec", title="HTML Title", content="HTML Content.")
    
    html = formatter.build_html([section], template)
    
    assert "<h2>HTML Title</h2>" in html
    assert "<p>HTML Content.</p>" in html
    assert "<!DOCTYPE html>" in html
