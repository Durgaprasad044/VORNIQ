# Forecast Agent (Agent 4)

## Purpose
Agent 4 in the VORNIQ platform. Consumes `FinancialDocument` (history) and `FinancialAnalysis` (health/KPIs) to generate structured `FinancialForecast` data.

## Core Capabilities
- **Assumption Engine**: Uses historical analysis and configs to set growth rules.
- **Scenario Analysis**: Generates Base, Upside, and Downside cases automatically.
- **Pluggable Models**: Architecture supports standard algorithms (Rule-Based, Linear Regression) out of the box, with interfaces ready for advanced ML injectables (XGBoost, Prophet).

## Architecture Boundaries
- **No Parser Overlap**: It expects `FinancialDocument` JSON directly; it does not read PDFs or Excels.
- **No Analysis Overlap**: It does not compute historical ratios, it relies on the Analyst Agent output.

## API Usage
```http
POST /api/v1/forecast/generate
```
Accepts: `{ "document": FinancialDocument, "analysis": FinancialAnalysis }`
Returns: `FinancialForecast`
