"""
Centralized Error Handling for the backend.
"""
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("error_handler")

class PipelineError(Exception):
    def __init__(self, message: str, stage: str):
        self.message = message
        self.stage = stage

def setup_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(PipelineError)
    async def pipeline_error_handler(request: Request, exc: PipelineError) -> JSONResponse:
        logger.error(f"Pipeline Error in {exc.stage}: {exc.message}")
        return JSONResponse(
            status_code=500,
            content={"error": "Pipeline Failure", "stage": exc.stage, "detail": exc.message}
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal Server Error", "detail": "An unexpected error occurred."}
        )
