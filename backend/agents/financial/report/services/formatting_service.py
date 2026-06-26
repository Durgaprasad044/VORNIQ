"""
Independent formatting builders.
"""

import json
from agents.financial.report.schemas.section_schema import ReportSection
from agents.financial.report.schemas.template_schema import ReportTemplate


class FormattingService:
    def build_markdown(self, sections: list[ReportSection], template: ReportTemplate) -> str:
        """Builds a Markdown formatted report."""
        doc = [f"*{template.headers}*\n"] if template.headers else []
        for sec in sections:
            doc.append(f"# {sec.title}\n{sec.content}\n")
        if template.footers:
            doc.append(f"\n*{template.footers}*")
        return "\n".join(doc)

    def build_html(self, sections: list[ReportSection], template: ReportTemplate) -> str:
        """Builds a structurally complete HTML report, ready for PDF conversion."""
        doc = ["<!DOCTYPE html><html><body>"]
        if template.headers:
            doc.append(f"<header><strong>{template.headers}</strong></header><hr>")
        for sec in sections:
            doc.append(f"<h2>{sec.title}</h2><p>{sec.content}</p>")
        if template.footers:
            doc.append(f"<hr><footer><em>{template.footers}</em></footer>")
        doc.append("</body></html>")
        return "".join(doc)
        
    def build_json(self, sections: list[ReportSection], template: ReportTemplate) -> str:
        """Builds a raw JSON payload for frontend or API consumers."""
        payload = {
            "header": template.headers,
            "footer": template.footers,
            "sections": [{"title": s.title, "content": s.content} for s in sections]
        }
        return json.dumps(payload)
