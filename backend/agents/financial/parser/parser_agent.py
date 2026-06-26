"""
Stub Parser Agent for Orchestrator integration.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.shared.schemas.financial_schema import FinancialDocument, DocumentMetadata

router = APIRouter(prefix="/api/v1/parser", tags=["Parser Agent"])


class ParserRequest(BaseModel):
    raw_text: str
    company_ticker: str


class ParserAgent:
    def __init__(self, config: dict[str, str] | None = None) -> None:
        self.config = config or {}

    async def execute(self, raw_text: str, company_ticker: str) -> FinancialDocument:
        """Stub: returns a minimal valid FinancialDocument."""
        meta = DocumentMetadata(
            filename="raw_input.txt",
            file_type="TEXT",
            extractor_used="stub_parser"
        )
        return FinancialDocument(metadata=meta, company_name=company_ticker)


agent = ParserAgent()


@router.post("/parse", response_model=FinancialDocument)
async def parse_document(request: ParserRequest) -> FinancialDocument:
    return await agent.execute(request.raw_text, request.company_ticker)


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "parser_agent"}
