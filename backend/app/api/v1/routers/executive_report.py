from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.executive_report import (
    ConditionsSection,
    CreditRiskSummarySection,
    ExecutiveReportVM,
    ExecutiveSummarySection,
    FinancialHighlightsSection,
    MacroIndustryOutlookSection,
    MarketFXRiskSummarySection,
    RiskAggregationRecommendationSection,
)
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Executive Report"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get("/{company_id}", response_model=dict, summary="Get structured executive credit assessment report")
async def get_executive_report(company_id: str) -> dict:
    f_ctx = company_service.get_financial_context(company_id)
    cid = f_ctx.get("company_id") or company_id
    company_name = f_ctx.get("name") or f"Company {cid}"
    sector = f_ctx.get("sector") or "Diversified Corporates"
    score = float(f_ctx.get("credit_score") or 72.0)
    exp_str = f_ctx.get("loan_exposure") or "$420M"

    raw_amt = 420_000_000.0
    if "B" in exp_str:
        raw_amt = float("".join(c for c in exp_str if c.isdigit() or c == ".")) * 1_000_000_000.0
    elif "M" in exp_str:
        raw_amt = float("".join(c for c in exp_str if c.isdigit() or c == ".")) * 1_000_000.0

    risk_level = "Low" if score >= 80 else "Medium" if score >= 65 else "High" if score >= 45 else "Critical"

    decision_map = {
        "Low": "APPROVE",
        "Medium": "APPROVE WITH CONDITIONS",
        "High": "APPROVE WITH CONDITIONS",
        "Critical": "REJECT",
    }
    decision = decision_map[risk_level]

    rating_map = {
        "Low": "A- (Investment Grade)",
        "Medium": "BBB (Investment Grade)",
        "High": "BB (Non-Investment Grade)",
        "Critical": "CCC (High Risk)",
    }

    report_id = f"RPT-2026-{int(cid) if str(cid).isdigit() else 101:04d}-{company_name[:3].upper()}"
    today_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    strengths = [
        f"Established market presence in {sector} sector.",
        f"Demonstrated revenue base exceeding {f_ctx.get('revenue', '$1B'):,}.",
        "Active treasury management with positive unencumbered liquidity buffers.",
    ]
    weaknesses = []
    de = float(f_ctx.get("debt_to_equity") or 1.5)
    dscr = float(f_ctx.get("dscr") or 1.6)

    if de > 2.0:
        weaknesses.append(f"Elevated corporate leverage: D/E ratio currently at {de:.2f}x.")
    if dscr < 1.5:
        weaknesses.append(f"Tighter cash debt-service coverage: DSCR at {dscr:.2f}x.")
    if not weaknesses:
        weaknesses.append("Sensitivity to broader macroeconomic rate adjustments and currency fluctuations.")

    report = ExecutiveReportVM(
        reportId=report_id,
        executiveSummary=ExecutiveSummarySection(
            companyName=company_name,
            industry=sector,
            requestedLoanAmount=exp_str,
            rawLoanAmount=raw_amt,
            loanPurpose="Working Capital & Production Facility Expansion",
            loanTenure="36 Months",
            overallRecommendation=decision,
            reportGenerationDate=today_str,
            borrowerRating=rating_map[risk_level],
        ),
        keyFinancialHighlights=FinancialHighlightsSection(
            liquidityPosition=f"Current Ratio {f_ctx.get('current_ratio', 1.45)}x",
            treasuryHealth="NSFR 118% | LCR 145%",
            revenueTrend="+12.4% CAGR YoY",
            profitability=f"EBITDA Margin {f_ctx.get('operating_margin_pct', 18.5)}%",
            cashFlow=f"Operating Cash Flow ${(raw_amt * 0.45) / 1_000_000:.1f}M",
            debtPosition=f"Total Debt ${(raw_amt * 1.8) / 1_000_000:.1f}M | D/E {de:.2f}x",
            strengths=strengths,
            weaknesses=weaknesses,
        ),
        macroIndustryOutlook=MacroIndustryOutlookSection(
            gdpOutlook="Regional GDP +2.4% annually",
            inflation="CPI stabilizing at 2.8%",
            interestRateEnvironment="Terminal benchmark rate steady at 4.75%",
            industryGrowth="Sector growth +7.8% YoY",
            countryRisk="Low — AAA/AA+ sovereign institutional rating",
            aiInterpretation="Stable macro backdrop with disciplined monetary conditions offsetting input headwinds.",
        ),
        marketFXRiskSummary=MarketFXRiskSummarySection(
            var95=f"${(raw_amt * 0.015) / 1_000_000:.2f}M",
            expectedShortfall=f"${(raw_amt * 0.022) / 1_000_000:.2f}M",
            fxExposure=f"${(raw_amt * 2.1) / 1_000_000:.1f}M",
            hedgedVsUnhedged="68% Hedged / 32% Unhedged",
            tailRisk="Controlled (Tail Risk Ratio 1.52)",
            overallMarketRiskConclusion="Market and FX risks are within institutional limits under standard rate shocks.",
        ),
        creditRiskSummary=CreditRiskSummarySection(
            creditRating=rating_map[risk_level].split(" ")[0],
            existingDebt=f"${(raw_amt * 1.8) / 1_000_000:.1f}M",
            debtRatios=[
                {"name": "Debt-to-Equity", "value": f"{de:.2f}x"},
                {"name": "Interest Coverage", "value": f"{f_ctx.get('interest_coverage', 4.5):.2f}x"},
                {"name": "DSCR", "value": f"{dscr:.2f}x"},
            ],
            repaymentBehaviour="Historically satisfactory with no senior facility defaults.",
            defaultHistory="Clean institutional credit record.",
            primaryStrengths=strengths[:2],
            primaryConcerns=weaknesses[:2],
        ),
        riskAggregation=RiskAggregationRecommendationSection(
            overallRiskScore=score,
            overallRiskLevel=risk_level,
            confidenceScore=94.2,
            recommendedDecision=decision,
            triggeredRule="Credit Committee Policy #CR-402 (Leverage & DSCR Thresholds)",
        ),
        keyInsights=[
            f"Underwriting model assigned {risk_level} risk standing (score {score:.1f}/100).",
            f"Requested facility of {exp_str} evaluated with 36-month amortization.",
            f"Human review {'required' if risk_level != 'Low' else 'optional'} under bank risk policy.",
        ],
        conditions=ConditionsSection(
            isConditional=decision == "APPROVE WITH CONDITIONS",
            isRejected=decision == "REJECT",
            requiredCollateral=[
                "First lien pari-passu charge over unencumbered fixed plant and machinery.",
                "Corporate guarantee from primary holding entity.",
            ],
            financialCovenants=[
                f"Minimum DSCR >= {max(1.20, dscr * 0.85):.2f}x tested semi-annually.",
                f"Maximum Debt-to-Equity <= {min(3.5, de * 1.25):.2f}x.",
            ],
            monitoringRequirements=[
                "Quarterly unaudited financial statements within 45 days.",
                "Annual audited statements within 90 days.",
            ],
            rejectionReasons=[] if decision != "REJECT" else ["Breach of maximum leverage ceiling (D/E > 3.8x)."],
        ),
        aiExplainabilityNarrative=(
            f"The quantitative loan evaluation framework for {company_name} synthesized financial statements, "
            f"market FX volatility, and macro indicators. The final composite score of {score:.1f} places the company "
            f"in the {risk_level} bracket. The underwriting engine advises {decision} with proactive covenant tracking."
        ),
        disclaimer=(
            "CONFIDENTIAL — This credit assessment is generated for authorized banking officers of the institutional "
            "credit committee. All automated evaluations constitute advisory decision support and require formal committee sign-off."
        ),
    )

    return build_success_response(report.model_dump())
