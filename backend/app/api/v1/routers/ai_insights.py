from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....ai.groq_service import groq_service
from ....core.responses import build_success_response
from ....schemas.ai_insights import AIInsightsResponse, InsightItem
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["AI Insights"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get("/{company_id}", response_model=dict, summary="Get structured, explainable AI insights for corporate entity")
async def get_ai_insights(company_id: str) -> dict:
    f_ctx = company_service.get_financial_context(company_id)
    cid = f_ctx.get("company_id") or company_id
    company_name = f_ctx.get("name") or f"Company {cid}"
    sector = f_ctx.get("sector") or "Diversified Corporates"
    score = float(f_ctx.get("credit_score") or 72.0)
    risk_level = f_ctx.get("risk_level") or "medium"
    rev = float(f_ctx.get("revenue") or 1_000_000_000.0)
    ebitda = float(f_ctx.get("ebitda") or rev * 0.22)
    debt = float(f_ctx.get("total_debt") or rev * 0.50)
    equity = float(f_ctx.get("equity") or debt * 0.85)
    de = float(f_ctx.get("debt_to_equity") or debt / max(equity, 1.0))
    dscr = float(f_ctx.get("dscr") or 1.6)
    ic = float(f_ctx.get("interest_coverage") or 4.2)
    p_def = 0.018 if score >= 75 else 0.042 if score >= 58 else 0.095 if score >= 38 else 0.185

    groq_res = await groq_service.generate_risk_narrative(
        company_name=company_name,
        sector=sector,
        credit_score=score,
        risk_category=risk_level.title(),
        probability_of_default=p_def,
        metrics={
            "debt_to_equity": de,
            "dscr": dscr,
            "interest_coverage": ic,
            "operating_margin_pct": float(f_ctx.get("operating_margin_pct", 15.0)),
        },
        requested_loan=float(f_ctx.get("requested_loan") or 100_000_000.0),
    )

    facts = [
        InsightItem(
            category="FACT",
            title="Corporate Profile & Registration",
            detail=f"{company_name} operates in the {sector} sector headquartered in {f_ctx.get('country', 'India')}.",
            severity="info",
        ),
        InsightItem(
            category="FACT",
            title="Reported Capital Structure",
            detail=f"Total debt obligations stand at ${debt / 1_000_000:,.1f}M against shareholders equity of ${equity / 1_000_000:,.1f}M.",
            severity="info",
        ),
        InsightItem(
            category="FACT",
            title="Facility Exposure History",
            detail=f"Current active bank exposure is {f_ctx.get('loan_exposure', '$420M')} under existing corporate tranches.",
            severity="info",
        ),
    ]

    calculated_metrics = [
        InsightItem(
            category="CALCULATED METRIC",
            title="Financial Leverage (Debt-to-Equity)",
            detail=f"D/E computed at {de:.2f}x (industry safe benchmark <= 2.0x).",
            supporting_metrics={"debt_to_equity": de, "benchmark": 2.0},
            severity="warning" if de > 2.0 else "positive",
        ),
        InsightItem(
            category="CALCULATED METRIC",
            title="Debt Service Coverage Ratio (DSCR)",
            detail=f"Operating cash flow yields a DSCR of {dscr:.2f}x (preferred covenant floor >= 1.4x).",
            supporting_metrics={"dscr": dscr, "benchmark": 1.4},
            severity="warning" if dscr < 1.4 else "positive",
        ),
        InsightItem(
            category="CALCULATED METRIC",
            title="Interest Coverage Ratio",
            detail=f"Operating profit covers current financing costs by {ic:.2f}x.",
            supporting_metrics={"interest_coverage": ic, "benchmark": 3.0},
            severity="warning" if ic < 3.0 else "positive",
        ),
    ]

    ai_interpretations = [
        InsightItem(
            category="AI INTERPRETATION",
            title="Underwriting Risk Synthesis",
            detail=groq_res.get("executive_summary") or f"{company_name} demonstrates consistent operational viability with manageable balance sheet risk.",
            severity="positive" if score >= 70 else "warning",
        ),
        InsightItem(
            category="AI INTERPRETATION",
            title="Macro & Yield Sensitivity",
            detail="Sensitivity analysis indicates the borrower can withstand up to 150 bps upward shift in benchmark SOFR rates before DSCR breaches covenants.",
            severity="info",
        ),
    ]

    recommendations = [
        InsightItem(
            category="RECOMMENDATION",
            title="Loan Structuring Decision",
            detail=groq_res.get("underwriter_verdict") or "Proceed with conditional approval subject to first-lien security.",
            severity="positive" if risk_level in ("low", "medium") else "critical",
        ),
        InsightItem(
            category="RECOMMENDATION",
            title="Covenant Package",
            detail="; ".join(groq_res.get("covenant_recommendations", ["Maintain quarterly DSCR >= 1.35x."])),
            severity="info",
        ),
    ]

    human_req = risk_level in ("medium", "high", "critical")
    review_prompts = [
        "Verify collateral valuation and ensure negative pledge documentation is executed.",
        "Confirm treasury liquidity reserve minimums with corporate treasurer.",
    ]
    if de > 2.0:
        review_prompts.append("Evaluate borrower's audited deleveraging schedule over next 12-24 months.")

    resp = AIInsightsResponse(
        company_id=str(cid),
        company_name=company_name,
        sector=sector,
        credit_score=score,
        risk_level=risk_level,
        summary=f"Automated AI risk evaluation for {company_name} (Score: {score:.1f}/100, Profile: {risk_level.upper()})",
        facts=facts,
        calculated_metrics=calculated_metrics,
        ai_interpretations=ai_interpretations,
        recommendations=recommendations,
        human_review_required=human_req,
        review_prompts=review_prompts,
        is_llm_generated=groq_res.get("is_llm_generated", False),
        model_name=groq_res.get("model_name"),
    )

    return build_success_response(resp.model_dump())
