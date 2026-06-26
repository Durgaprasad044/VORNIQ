"""
Pydantic v2 schemas representing the shared financial data contracts.

These models define the standardized representation of financial documents,
statements, periods, and individual metrics used across the entire platform.
"""

from datetime import datetime, timezone
from pydantic import BaseModel, Field


class FinancialMetric(BaseModel):
    """
    Standardized container for a single extracted financial metric.
    
    Retains both the raw/original representation and the standardized/normalized value
    to ensure traceability and auditing of the extraction process.
    """
    original: str | None = Field(
        default=None,
        description="The raw string value extracted from the document before normalization.",
    )
    normalized: float | None = Field(
        default=None,
        description="The normalized numeric value (absolute amount, e.g. 1000000.00 for $1M).",
    )
    currency: str | None = Field(
        default=None,
        description="The detected currency code (e.g. USD, EUR, INR).",
    )
    unit: str | None = Field(
        default=None,
        description="The detected scaling unit (e.g. Millions, Thousands, Ones).",
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Confidence score for this specific metric extraction (0.0 to 1.0).",
    )


class FinancialPeriodData(BaseModel):
    """
    Financial statements extracted for a specific fiscal period (e.g., FY2023, Q3 2024).
    
    Uses dictionary mappings from string metric keys (e.g. 'revenue', 'total_assets')
    to FinancialMetric instances. This allows dynamic support for any metric key,
    ensuring unknown or custom metrics are preserved without requiring schema changes.
    """
    income_statement: dict[str, FinancialMetric] = Field(
        default_factory=dict,
        description="Key-value pairs of metrics belonging to the Income Statement.",
    )
    balance_sheet: dict[str, FinancialMetric] = Field(
        default_factory=dict,
        description="Key-value pairs of metrics belonging to the Balance Sheet.",
    )
    cash_flow: dict[str, FinancialMetric] = Field(
        default_factory=dict,
        description="Key-value pairs of metrics belonging to the Cash Flow Statement.",
    )


class DocumentMetadata(BaseModel):
    """
    Metadata about the ingestion, extraction, and processing of the document.
    """
    filename: str = Field(
        description="Original name of the uploaded document.",
    )
    file_type: str = Field(
        description="Detected file type/extension (e.g. PDF, CSV, XLSX).",
    )
    processing_time_seconds: float = Field(
        default=0.0,
        description="Total duration of the extraction and processing pipeline.",
    )
    extractor_used: str = Field(
        description="Name of the extractor class used (e.g. PDFExtractor, ExcelExtractor).",
    )
    overall_confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Aggregated confidence score across all extracted fields.",
    )
    warnings: list[str] = Field(
        default_factory=list,
        description="Validation warnings or low-confidence notices produced during processing.",
    )
    errors: list[str] = Field(
        default_factory=list,
        description="Non-fatal execution errors encountered during processing.",
    )
    processed_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp of when the document was processed.",
    )


class FinancialDocument(BaseModel):
    """
    The root schema representing all financial data extracted from a document.
    
    This is the standard model returned by the Parser Agent and consumed by
    downstream agents (Analyst, Forecast, Risk, Report).
    """
    metadata: DocumentMetadata = Field(
        description="Extraction metadata, warnings, and system logs.",
    )
    company_name: str | None = Field(
        default=None,
        description="Standardized name of the target entity/company.",
    )
    periods: dict[str, FinancialPeriodData] = Field(
        default_factory=dict,
        description="Map of period identifiers (e.g., '2023', 'Q2_2024') to financial statements.",
    )
