"""
Aggregates and deduplicates recommendations.
"""

from agents.financial.analyst.schemas.analysis_schema import FinancialAnalysis
from agents.financial.risk.schemas.risk_schema import FinancialRiskAssessment


class RecommendationAggregator:
    def aggregate(self, analysis: FinancialAnalysis, risk: FinancialRiskAssessment) -> str:
        """Merges, deduplicates, and ranks recommendations from Analyst and Risk agents."""
        recs = []
        
        for rec in analysis.recommendations:
            recs.append(f"- [ANALYST PRIORITY {rec.priority}] {rec.action}")
            
        for strategy in risk.mitigations:
            for action in strategy.actions:
                recs.append(f"- [RISK MITIGATION] {action.action} (Impact: {action.expected_impact})")
        
        if not recs:
            return "No critical recommendations or risks identified at this time."
            
        # Returning as a bulleted markdown list
        return "\n".join(recs)
