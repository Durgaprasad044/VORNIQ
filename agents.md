# AGENT 6 IMPLEMENTATION PROMPT — Report Generation Agent

The project architecture has already been defined in **MASTER_ARCHITECTURE.md**.

Read and strictly follow every rule in that document.

Do NOT modify the architecture.

Do NOT rename folders.

Do NOT modify shared schemas unless absolutely necessary.

Treat MASTER_ARCHITECTURE.md as the project's single source of truth.

---

# YOUR TASK

Implement **Agent 6 — Financial Report Generation Agent**.

This agent is responsible for transforming structured financial intelligence into professional business reports.

This agent must NEVER

* Parse documents
* Perform financial analysis
* Forecast values
* Calculate risks
* Store memory

Its ONLY responsibility is report generation.

---

# LOCATION

Implement only inside

backend/

agents/

financial/

report/

Follow the architecture exactly.

---

# PRIMARY RESPONSIBILITIES

Generate

Executive Summary

Financial Analysis Report

Board Report

Investor Report

Risk Report

Forecast Report

Company Health Report

Investment Summary

Decision Support Report

Audit Summary

Portfolio Report

Business Intelligence Report

Markdown Reports

JSON Reports

HTML Reports

PDF-ready content

---

# INPUT

Consume ONLY

FinancialDocument

FinancialAnalysis

FinancialForecast

FinancialRiskAssessment

Never parse PDFs.

Never duplicate previous agents.

---

# OUTPUT

Return

FinancialReport

Containing

Executive Summary

Business Overview

Financial Highlights

KPI Summary

Forecast Summary

Risk Summary

Recommendations

Appendix

Metadata

Confidence Score

Warnings

---

# REPORT TYPES

Support

Executive

Board

Investor

Management

Operations

Compliance

Risk

Forecast

Audit

Custom

Everything configurable.

---

# REPORT SECTIONS

Support dynamic sections.

Examples

Cover Page

Company Information

Executive Summary

Key Metrics

Financial Statements

KPI Analysis

Trend Analysis

Forecast

Risk Assessment

Recommendations

Appendix

Footer

Users should be able to enable or disable sections via configuration.

---

# FORMATTING ENGINE

Create independent builders

Markdown Builder

HTML Builder

JSON Builder

PDF Content Builder

Executive Builder

Board Builder

Each builder must be independent.

---

# TEMPLATE ENGINE

Load templates dynamically.

Do NOT hardcode report layouts.

Templates should live in

shared/prompts/

or

shared/resources/

Allow new templates without modifying code.

---

# NARRATIVE ENGINE

Generate professional business language.

Examples

Executive Summary

Financial Highlights

Key Risks

Strategic Recommendations

Future Outlook

Never hallucinate.

Only describe supported data.

---

# RECOMMENDATIONS

Merge recommendations from

Financial Analyst

Forecast

Risk

Deduplicate

Rank by priority

Generate a final action plan.

---

# REPORT METADATA

Include

Generated Time

Agent Versions

Source Agents

Confidence

Processing Time

Report Type

Report Version

---

# SERVICES

Create

Report Service

Template Service

Narrative Service

Formatting Service

Recommendation Aggregator

Section Builder

Business logic must remain inside services.

---

# CONFIGURATION

Everything configurable.

Load dynamically

Report templates

Report sections

Formatting

Languages

Branding

Headers

Footers

Recommendation priorities

No hardcoding.

---

# LLM

Use prompts stored inside

shared/prompts/

Never embed prompts inside Python.

---

# VALIDATION

Validate

Missing analysis

Missing forecast

Missing risks

Missing financial document

Invalid report template

Return warnings.

Never fail silently.

---

# LOGGING

Log

Report generation started

Template selected

Sections included

Execution time

Warnings

Errors

Confidence

Never log confidential financial values.

---

# ERROR HANDLING

Handle

Missing inputs

Template failure

Formatting failure

Large reports

Configuration errors

Return structured exceptions.

---

# TESTING

Generate tests for

Report generation

Template engine

Narrative generation

Section builder

Formatting engine

Recommendation aggregation

Schemas

API

---

# DOCUMENTATION

Generate

README

Architecture

Report Flow

Template Guide

Configuration Guide

API Examples

---

# CODING RULES

Python 3.12

FastAPI

Pydantic v2

Async

Dependency Injection

SOLID

DRY

Type Hints

Reusable Services

No Magic Numbers

No Placeholder Code

No Mock Financial Data

No Hardcoded Templates

No Hardcoded Text

---

# IMPLEMENTATION ORDER

Generate exactly one file per response.

Follow this order.

1. Folder verification

2. report_schema.py

3. template_schema.py

4. section_schema.py

5. report_service.py

6. template_service.py

7. narrative_service.py

8. formatting_service.py

9. recommendation_aggregator.py

10. section_builder.py

11. report_agent.py

12. report_routes.py

13. tests

14. README

Stop after every file.

Wait for my approval before generating the next one.

Never generate multiple files in one response.

Maintain complete compatibility with Parser Agent, Analyst Agent, Forecast Agent, Risk Agent, Memory Agent, Runtime Agent, and Orchestrator Agent.
