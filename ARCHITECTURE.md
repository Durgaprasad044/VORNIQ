# MASTER_ARCHITECTURE.md

# Enterprise Multi-Agent Financial Intelligence Platform

## Purpose

You are a Principal AI Engineer and Software Architect...

> NOTE TO THE AI IDE: Never generate the whole project in one step.
> First produce architecture, then implement one file at a time after
> approval.

# PROJECT GOALS

-   Build a production-quality multi-agent financial intelligence
    platform.
-   Zero hardcoding.
-   Modular, testable, scalable architecture.
-   Hindsight for persistent memory.
-   cascadeflow for runtime routing.
-   FastAPI backend.

# AGENTS

## Core

-   Orchestrator Agent
-   Memory Agent
-   Runtime Agent

## Financial

-   Financial Parser Agent
-   Financial Analyst Agent
-   Forecast Agent
-   Risk Agent
-   Report Agent

# FOLDER STRUCTURE

``` text
backend/
├── agents/
│   ├── core/
│   │   ├── orchestrator/
│   │   ├── memory/
│   │   ├── runtime/
│   │   └── communication/
│   ├── financial/
│   │   ├── parser/
│   │   ├── analyst/
│   │   ├── forecast/
│   │   ├── risk/
│   │   └── report/
│   └── shared/
│       ├── schemas/
│       ├── services/
│       ├── validators/
│       ├── prompts/
│       ├── resources/
│       ├── config/
│       └── utils/
├── api/
├── app.py
├── requirements.txt
└── .env.example
```

# ZERO HARDCODING POLICY

Never hardcode: - company names - metrics - currencies - thresholds -
prompt text - API keys - providers - model names - validation rules -
upload paths

Everything must come from: - .env - config - JSON resources - dependency
injection - runtime detection

# SHARED RESOURCES

financial_dictionary.json validation_rules.json currencies.json
units.json

# AGENT RESPONSIBILITIES

## Orchestrator

Routes every request to the correct agent.

## Memory

Stores user preferences, previous companies, conversations and analysis
using Hindsight.

## Runtime

Uses cascadeflow to select providers/models, enforce budgets, log cost,
latency and routing.

## Parser

Accept PDF/CSV/XLSX. Extract structured statements. Normalize and
validate.

## Analyst

Financial ratios, KPI analysis, recommendations, executive summaries.

## Forecast

Revenue, EBITDA, cash flow forecasting. Base/upside/downside scenarios.

## Risk

Liquidity, leverage, solvency, burn rate, anomaly detection.

## Report

Generate PDF/Markdown/Board summaries.

# API CONTRACTS

POST /api/v1/parser/upload POST /api/v1/analyze POST /api/v1/forecast
POST /api/v1/risk POST /api/v1/report GET /api/v1/health

# CODING STANDARDS

-   Python 3.12
-   FastAPI
-   Async
-   Pydantic v2
-   Type hints
-   SOLID
-   DRY
-   Dependency Injection
-   Structured logging
-   100% configurable

# IMPLEMENTATION ORDER

1.  Architecture
2.  Shared schemas
3.  Shared config
4.  Parser Agent
5.  Memory Agent
6.  Runtime Agent
7.  Analyst Agent
8.  Forecast Agent
9.  Risk Agent
10. Report Agent
11. API
12. Tests
13. Documentation

Generate ONE FILE PER RESPONSE. Never skip files. Never output
placeholder implementations.
