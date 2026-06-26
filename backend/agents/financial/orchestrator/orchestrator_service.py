"""
Orchestrator Service.
Coordinates the execution of all 6 agents sequentially.
"""
import time
import logging

from agents.financial.orchestrator.schemas import UnifiedPipelineRequest, UnifiedPipelineResponse, PipelineMetadata
from agents.financial.parser.parser_agent import ParserAgent
from agents.financial.memory.services.base_service import BaseMemoryService
from agents.financial.analyst.analyst_agent import FinancialAnalystAgent
from agents.financial.forecast.forecast_agent import ForecastAgent
from agents.financial.risk.risk_agent import FinancialRiskAssessmentAgent
from agents.financial.report.report_agent import FinancialReportGenerationAgent

logger = logging.getLogger("orchestrator")


class OrchestratorService:
    def __init__(
        self,
        parser: ParserAgent,
        memory: BaseMemoryService,
        analyst: FinancialAnalystAgent,
        forecast: ForecastAgent,
        risk: FinancialRiskAssessmentAgent,
        report: FinancialReportGenerationAgent
    ) -> None:
        self.parser = parser
        self.memory = memory
        self.analyst = analyst
        self.forecast = forecast
        self.risk = risk
        self.report = report

    async def run_pipeline(self, request: UnifiedPipelineRequest) -> UnifiedPipelineResponse:
        start_time = time.time()
        logger.info(f"Starting pipeline for ticker: {request.company_ticker}")

        try:
            # 1. Parser
            logger.info("Executing Parser Agent")
            document = await self.parser.execute(
                raw_text=request.raw_text or "",
                company_ticker=request.company_ticker
            )

            # 2. Memory
            logger.info("Executing Memory Agent")
            record_id = await self.memory.store_memory(
                entity_id=request.company_ticker,
                memory_type="document",
                metadata={"company_name": document.company_name or request.company_ticker}
            )

            # 3. Analyst
            logger.info("Executing Analyst Agent")
            analysis = await self.analyst.execute(document=document)

            # 4. Forecast
            logger.info("Executing Forecast Agent")
            forecast = await self.forecast.execute(document=document, analysis=analysis)

            # 5. Risk
            logger.info("Executing Risk Agent")
            risk_assessment = await self.risk.execute(document=document, analysis=analysis, forecast=forecast)

            # 6. Report
            logger.info("Executing Report Agent")
            report = await self.report.execute(
                document=document,
                analysis=analysis,
                forecast=forecast,
                risk=risk_assessment,
                report_type=request.report_type
            )

            total_time = int((time.time() - start_time) * 1000)
            logger.info(f"Pipeline completed successfully in {total_time}ms")

            metadata = PipelineMetadata(
                total_processing_time_ms=total_time,
                status="success"
            )

            return UnifiedPipelineResponse(
                metadata=metadata,
                parsed_document=document,
                memory_record_ids=[record_id],
                analysis=analysis,
                forecast=forecast,
                risk_assessment=risk_assessment,
                final_report=report
            )

        except Exception as e:
            logger.error(f"Pipeline failed: {str(e)}", exc_info=True)
            total_time = int((time.time() - start_time) * 1000)
            return UnifiedPipelineResponse(
                metadata=PipelineMetadata(
                    total_processing_time_ms=total_time,
                    status="error",
                    warnings=[str(e)]
                )
            )
