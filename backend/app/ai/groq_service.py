import json
import logging
from typing import Any, Optional
import httpx

from ..config.settings import settings

logger = logging.getLogger("roiq.groq")


class GroqLLMService:
    """Provides LLM inference for financial risk narrative, executive insights,
    and underwriting explanations using Groq or high-quality deterministic fallback."""

    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(self) -> None:
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model

    async def generate_risk_narrative(
        self,
        company_name: str,
        sector: str,
        credit_score: float,
        risk_category: str,
        probability_of_default: float,
        metrics: dict[str, Any],
        requested_loan: float,
    ) -> dict[str, Any]:
        """Generates structured financial narrative and recommendations."""
        if not self.api_key:
            return self._deterministic_narrative(
                company_name, sector, credit_score, risk_category, probability_of_default, metrics, requested_loan
            )

        system_prompt = (
            "You are a Senior Corporate Credit Underwriter in an institutional banking COE. "
            "Provide objective, rigorous credit risk evaluation based on given financial ratios. "
            "Do NOT make unsubstantiated claims or allege fraud/criminal conduct. "
            "Output JSON with keys: 'executive_summary', 'key_concerns', 'positive_aspects', "
            "'covenant_recommendations', 'underwriter_verdict'."
        )

        user_content = (
            f"Borrower: {company_name}\n"
            f"Sector: {sector}\n"
            f"Calculated Score: {credit_score}/100\n"
            f"Risk Category: {risk_category}\n"
            f"Probability of Default: {probability_of_default * 100:.2f}%\n"
            f"Requested Loan: ${requested_loan:,.0f}\n"
            f"Financial Ratios: {json.dumps(metrics)}"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2,
            "max_tokens": 1000,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(self.GROQ_API_URL, headers=headers, json=payload)
                res.raise_for_status()
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                parsed["is_llm_generated"] = True
                parsed["model_name"] = self.model
                return parsed
        except Exception as exc:
            logger.warning(f"Groq API unavailable or error: {exc}. Using deterministic financial reasoning fallback.")
            return self._deterministic_narrative(
                company_name, sector, credit_score, risk_category, probability_of_default, metrics, requested_loan
            )

    def _deterministic_narrative(
        self,
        company_name: str,
        sector: str,
        credit_score: float,
        risk_category: str,
        probability_of_default: float,
        metrics: dict[str, Any],
        requested_loan: float,
    ) -> dict[str, Any]:
        """High-precision, deterministic underwriting narrative fallback."""
        de = float(metrics.get("debt_to_equity", 1.8))
        dscr = float(metrics.get("dscr", 1.5))
        ic = float(metrics.get("interest_coverage", 4.0))
        op_margin = float(metrics.get("operating_margin_pct", 15.0))

        positives = []
        concerns = []

        if ic >= 4.0:
            positives.append(f"Strong interest coverage of {ic:.2f}x provides substantial cushion against rate spikes.")
        else:
            concerns.append(f"Compressed interest coverage of {ic:.2f}x limits capacity to absorb incremental debt servicing.")

        if dscr >= 1.6:
            positives.append(f"Healthy Debt Service Coverage Ratio (DSCR) of {dscr:.2f}x supports scheduled amortization.")
        else:
            concerns.append(f"Sub-optimal DSCR of {dscr:.2f}x presents potential cash-flow tightening in adverse cycles.")

        if de <= 1.5:
            positives.append(f"Conservative capital structure with D/E ratio of {de:.2f}x.")
        else:
            concerns.append(f"Elevated financial leverage with Debt-to-Equity at {de:.2f}x vs benchmark 2.0x.")

        if op_margin >= 18.0:
            positives.append(f"Robust operating margin of {op_margin:.1f}% indicates pricing power and operating efficiency.")
        else:
            concerns.append(f"Operating margin of {op_margin:.1f}% warrants ongoing operating cost monitoring.")

        if not positives:
            positives.append(f"Established franchise footprint in {sector} with ongoing revenue visibility.")
        if not concerns:
            concerns.append("Broad macro sensitivity to monetary policy changes and commodity cycles.")

        covenants = [
            f"Maintain minimum quarterly DSCR >= {max(1.25, round(dscr * 0.85, 2)):.2f}x.",
            f"Audited annual covenant compliance certificate delivered within 90 days of fiscal year-end.",
        ]
        if risk_category in ("High", "Critical"):
            covenants.append("Negative pledge and first-lien priority on fixed productive assets.")
            covenants.append("Dividend payouts restricted pending deleveraging below 2.2x D/E.")

        summary = (
            f"Credit assessment for {company_name} indicates a {risk_category} risk profile "
            f"with a quantitative underwriter score of {credit_score:.1f}/100 and 1-year default probability of "
            f"{probability_of_default * 100:.2f}%. Corporate profile demonstrates {positives[0]}."
        )

        return {
            "executive_summary": summary,
            "key_concerns": concerns,
            "positive_aspects": positives,
            "covenant_recommendations": covenants,
            "underwriter_verdict": f"{'Recommend Approval' if risk_category == 'Low' else 'Conditionally Approved Subject to Credit Committee Review' if risk_category in ('Medium', 'High') else 'Decline Facility'}",
            "is_llm_generated": False,
            "model_name": "Deterministic-Rule-Engine-v1",
        }


groq_service = GroqLLMService()
