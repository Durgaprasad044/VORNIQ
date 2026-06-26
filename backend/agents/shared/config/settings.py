"""
Application settings loaded from environment variables using Pydantic Settings.

All configuration is centralized here. No hardcoded values anywhere in the codebase.
Every agent and service receives its configuration via dependency injection from this module.
"""

from pathlib import Path
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


# Resolve the project root relative to this file's location
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
_RESOURCES_DIR = Path(__file__).resolve().parent.parent / "shared" / "resources"


class ParserSettings(BaseSettings):
    """Configuration specific to the Financial Parser Agent."""

    max_upload_size_mb: int = Field(
        default=50,
        description="Maximum file upload size in megabytes",
    )
    supported_extensions: list[str] = Field(
        default=[".pdf", ".csv", ".xls", ".xlsx"],
        description="Allowed file extensions for upload",
    )
    ocr_enabled: bool = Field(
        default=True,
        description="Whether to attempt OCR on image-based PDFs",
    )
    ocr_language: str = Field(
        default="eng",
        description="Tesseract OCR language code",
    )
    ocr_dpi: int = Field(
        default=300,
        description="DPI for PDF-to-image conversion during OCR",
    )
    processing_timeout_seconds: int = Field(
        default=120,
        description="Maximum time allowed for processing a single document",
    )

    model_config = {"env_prefix": "PARSER_"}


class ConfidenceSettings(BaseSettings):
    """Configuration for confidence scoring thresholds."""

    minimum_threshold: float = Field(
        default=0.6,
        description="Minimum confidence score before a warning is generated",
    )
    high_confidence: float = Field(
        default=0.9,
        description="Threshold above which a value is considered highly confident",
    )
    ocr_penalty: float = Field(
        default=0.15,
        description="Confidence reduction applied to OCR-extracted values",
    )
    pattern_match_base: float = Field(
        default=0.85,
        description="Base confidence for regex/pattern-matched values",
    )
    exact_match_base: float = Field(
        default=0.95,
        description="Base confidence for exact dictionary-matched values",
    )

    model_config = {"env_prefix": "CONFIDENCE_"}


class LoggingSettings(BaseSettings):
    """Configuration for structured logging."""

    level: str = Field(
        default="INFO",
        description="Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL",
    )
    format: str = Field(
        default="json",
        description="Log format: json or text",
    )
    log_file: str | None = Field(
        default=None,
        description="Optional log file path. None means stdout only",
    )

    model_config = {"env_prefix": "LOG_"}


class AppSettings(BaseSettings):
    """Root application settings."""

    app_name: str = Field(
        default="VORNIQ Financial Intelligence Platform",
        description="Application name",
    )
    app_version: str = Field(
        default="0.1.0",
        description="Application version",
    )
    debug: bool = Field(
        default=False,
        description="Enable debug mode",
    )
    host: str = Field(
        default="0.0.0.0",
        description="Server host",
    )
    port: int = Field(
        default=8000,
        description="Server port",
    )
    cors_origins: list[str] = Field(
        default=["http://localhost:3000"],
        description="Allowed CORS origins",
    )
    api_version: str = Field(
        default="v1",
        description="Current API version prefix",
    )

    # Sub-settings
    parser: ParserSettings = Field(default_factory=ParserSettings)
    confidence: ConfidenceSettings = Field(default_factory=ConfidenceSettings)
    logging: LoggingSettings = Field(default_factory=LoggingSettings)

    # Paths
    resources_dir: Path = Field(
        default=_RESOURCES_DIR,
        description="Path to shared JSON resource files",
    )

    model_config = {
        "env_prefix": "VORNIQ_",
        "env_file": str(_PROJECT_ROOT / ".env"),
        "env_file_encoding": "utf-8",
        "env_nested_delimiter": "__",
    }


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    """
    Return the cached application settings singleton.

    Uses lru_cache to ensure settings are loaded only once and reused
    across all dependency injection sites.
    """
    return AppSettings()
