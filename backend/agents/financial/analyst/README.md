# Financial Analyst Agent

## Purpose
Agent 3 in the VORNIQ platform. Consumes structured `FinancialDocument` JSON (produced by the Parser Agent) and generates a comprehensive `FinancialAnalysis`.

## Core Capabilities
- **KPI Calculations**: Computes liquidity, profitability, efficiency, and leverage ratios.
- **Health Scoring**: Aggregates categorical performance into a singular health score.
- **Recommendations**: Generates actionable, data-supported advice based on KPI variances.
- **Narratives**: Synthesizes human-readable insights for executive consumption.

## Configuration
All ratios and thresholds are designed to be dynamically driven by configuration (zero-hardcoding).

## API
```http
POST /api/v1/analyst/analyze
```
Accepts: `FinancialDocument`  
Returns: `FinancialAnalysis`
