# Financial Risk Assessment Agent (Agent 5)

## Purpose
Agent 5 in the VORNIQ platform. It acts as an autonomous threat-detection engine, evaluating structured financial histories, KPI trends, and forward-looking forecasts to surface vulnerabilities and recommend mitigations.

## Core Capabilities
- **Anomaly Detection**: Scans inputs for unexpected drops, data inconsistencies, and standard red flags.
- **Stress Testing**: Programmatically shocks assumptions (e.g., revenue drops, interest rate hikes) to determine business continuity risk.
- **Mitigation Generation**: Maps detected vulnerabilities to actionable, targeted strategies.

## Execution Constraints
- **Strictly Decoupled**: Does not duplicate parsing logic, KPI calculations, or forecasting models. 
- **Configuration-Driven**: All thresholds for anomalies and stress parameters are loaded dynamically.

## API Usage
```http
POST /api/v1/risk/assess
```
Accepts: `{ "document": FinancialDocument, "analysis": FinancialAnalysis, "forecast": FinancialForecast }`
Returns: `FinancialRiskAssessment`
