# Financial Report Generation Agent (Agent 6)

## Purpose
Agent 6 serves as the presentation layer of the VORNIQ platform. It aggregates raw, structured JSON intelligence from all previous agents (Parser, Analyst, Forecast, Risk) and builds professional, formatted business reports.

## Core Capabilities
- **Template Engine**: Dynamically maps report types (e.g. Executive, Board, Audit) to a specific ordered list of sections.
- **Narrative Generation**: Summarizes data into professional prose without hallucinating non-existent facts.
- **Formatting Engines**: Simultaneously renders Markdown, HTML (PDF-ready), and JSON payloads so downstream services can consume the report natively.
- **Aggregators**: Deduplicates recommendations across Analyst and Risk branches into a cohesive action plan.

## API Usage
```http
POST /api/v1/report/generate
```
Accepts: `{ "document": FinancialDocument, "analysis": FinancialAnalysis, "forecast": FinancialForecast, "risk": FinancialRiskAssessment, "report_type": "Executive" }`
Returns: `FinancialReport` (contains `formatted_content` mapping)
