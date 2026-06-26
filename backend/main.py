"""
Main Application Entrypoint.
Wires up the Orchestrator and all Agent routers.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Exception handlers
from exceptions import setup_exception_handlers

# Import routers
from agents.financial.parser.parser_agent import router as parser_router
from agents.financial.memory.memory_routes import router as memory_router
from agents.financial.memory.health_routes import router as memory_health_router
from agents.financial.analyst.analyst_routes import router as analyst_router
from agents.financial.forecast.forecast_routes import router as forecast_router
from agents.financial.risk.risk_routes import router as risk_router
from agents.financial.report.report_routes import router as report_router
from agents.financial.orchestrator.orchestrator_routes import router as orchestrator_router

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

# Initialize FastAPI App
app = FastAPI(title="VORNIQ API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Centralized Error Handling
setup_exception_handlers(app)

# Include Routers
app.include_router(parser_router)
app.include_router(memory_router)
app.include_router(memory_health_router)
app.include_router(analyst_router)
app.include_router(forecast_router)
app.include_router(risk_router)
app.include_router(report_router)
app.include_router(orchestrator_router)

@app.get("/health")
async def root_health() -> dict[str, str]:
    return {"status": "ok", "service": "vorniq-backend"}
