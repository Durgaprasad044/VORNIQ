"""
Global Dependency Injection Container.
Registers and resolves services for all agents.
"""

from agents.financial.parser.parser_agent import ParserAgent
from agents.financial.analyst.analyst_agent import FinancialAnalystAgent
from agents.financial.forecast.forecast_agent import ForecastAgent
from agents.financial.risk.risk_agent import FinancialRiskAssessmentAgent
from agents.financial.report.report_agent import FinancialReportGenerationAgent
from agents.financial.memory.dependencies import get_memory_service as get_memory_service


def get_parser_agent() -> ParserAgent:
    return ParserAgent()


def get_analyst_agent() -> FinancialAnalystAgent:
    return FinancialAnalystAgent()


def get_forecast_agent() -> ForecastAgent:
    return ForecastAgent()


def get_risk_agent() -> FinancialRiskAssessmentAgent:
    return FinancialRiskAssessmentAgent()


def get_report_agent() -> FinancialReportGenerationAgent:
    return FinancialReportGenerationAgent()
