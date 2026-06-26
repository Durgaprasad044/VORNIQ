"""
Mitigation Strategy Service.
"""

from typing import Any
from agents.financial.risk.schemas.risk_schema import IdentifiedRisk
from agents.financial.risk.schemas.mitigation_schema import MitigationStrategy, MitigationAction


class MitigationService:
    def generate_mitigations(
        self, 
        top_risks: list[IdentifiedRisk], 
        config: dict[str, Any]
    ) -> list[MitigationStrategy]:
        strategies = []
        for risk in top_risks:
            if risk.category == "Liquidity":
                strategies.append(MitigationStrategy(
                    risk_name=risk.name,
                    category=risk.category,
                    actions=[
                        MitigationAction(
                            action="Secure a revolving credit facility.",
                            effort="Medium",
                            expected_impact="Improves short term cash runway by 6 months."
                        )
                    ]
                ))
        return strategies
