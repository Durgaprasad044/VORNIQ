import time
import pytest
from agents.financial.analyst.analyst_agent import FinancialAnalystAgent
from agents.shared.schemas.financial_schema import FinancialDocument

@pytest.mark.asyncio
async def test_agent_execution_performance(sample_financial_document: FinancialDocument) -> None:
    """Performance Check: Ensure the analyst agent executes quickly."""
    agent = FinancialAnalystAgent()
    
    start_time = time.perf_counter()
    result = await agent.execute(sample_financial_document)
    duration = time.perf_counter() - start_time
    
    assert result is not None
    # Agent is pure computation; it should easily execute under 100ms
    assert duration < 0.1, f"Performance warning: Agent took {duration:.3f}s to execute"
