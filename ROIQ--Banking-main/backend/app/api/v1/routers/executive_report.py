from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....core.synthetic_dataset import (
    SYNTHETIC_DATA_LABEL,
    SYNTHETIC_INDIAN_COMPANY,
)
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
    company_name = f_ctx.get("name") or SYNTHETIC_INDIAN_COMPANY["name"]
    sector = f_ctx.get("sector") or SYNTHETIC_INDIAN_COMPANY["sector"]
    score = float(f_ctx.get("credit_score") or 72.0)

    # Standardized in ₹ Lakh
    raw_amt = SYNTHETIC_INDIAN_COMPANY["requested_loan"]  # 450.0 lakh
    exp_str = f"₹{raw_amt:.2f} lakh"

    risk_level = "Low" if score >= 75 else "Medium" if score >= 58 else "High" if score >= 45 else "Critical"

    decision_map = {
        "Low": "APPROVE",
        "Medium": "APPROVE WITH CONDITIONS",
        "High": "APPROVE WITH CONDITIONS",
        "Critical": "REJECT",
    }
    decision = decision_map[risk_level]

    officer_signoff = None
    try:
        from backend.app.db.session import SessionLocal
        from backend.app.db.repositories.credit_repository import CreditRepository
        with SessionLocal() as db:
            repo = CreditRepository(db)
            cid_int = int(cid) if str(cid).isdigit() else 1
            eval_record = repo.get_latest_by_company(cid_int)
            rec_record = repo.get_latest_recommendation_by_company(cid_int)
            review_record = repo.get_latest_human_review_by_company(cid_int)
            if eval_record:
                score = float(eval_record.credit_score)
                risk_level = eval_record.risk_category
            if rec_record:
                decision = rec_record.decision.replace("_", " ") if rec_record.decision else decision
                raw_amt = float(rec_record.requested_amount)
                exp_str = f"₹{raw_amt:.2f} lakh"
            if review_record:
                officer_signoff = f"Officer Sign-off ({review_record.officer}): {review_record.notes} (Approved: {review_record.approved})"
    except Exception as e:
        print("EXECUTIVE_REPORT_DB_ERR:", e)

    rating_map = {
        "Low": "A- (Investment Grade)" if score < 85 else "AA- (Investment Grade)",
        "Medium": "BBB (Investment Grade)",
        "High": "BB (Non-Investment Grade)",
        "Critical": "CCC (High Risk)",
    }

    report_id = f"RPT-2026-{int(cid) if str(cid).isdigit() else 101:04d}-{company_name[:3].upper()}"
    today_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    strengths = [
        f"Established market presence in {sector} sector.",
        f"Annual revenue of ₹{SYNTHETIC_INDIAN_COMPANY['annual_revenue']:.0f} lakh with ₹{SYNTHETIC_INDIAN_COMPANY['ebitda']:.0f} lakh EBITDA.",
        f"Prudent cash reserves of ₹{SYNTHETIC_INDIAN_COMPANY['cash_and_equivalents']:.0f} lakh providing 3.0 months cash coverage.",
    ]
    weaknesses = []
    de = SYNTHETIC_INDIAN_COMPANY["debt_to_equity"]  # 0.75x
    dscr = SYNTHETIC_INDIAN_COMPANY["dscr"]  # 2.0x
    cov = SYNTHETIC_INDIAN_COMPANY["ebitda_interest_coverage"]  # 4.0x

    if de > 2.0:
        weaknesses.append(f"Elevated corporate leverage: D/E ratio currently at {de:.2f}x.")
    if dscr < 1.5:
        weaknesses.append(f"Tighter cash debt-service coverage: DSCR at {dscr:.2f}x.")
    if not weaknesses:
        weaknesses.append("Sensitivity to input raw material cost variations and interest rate cycles.")

    report = ExecutiveReportVM(
        reportId=report_id,
        executiveSummary=ExecutiveSummarySection(
            companyName=company_name,
            industry=sector,
            requestedLoanAmount=exp_str,
            rawLoanAmount=raw_amt,
            loanPurpose="Working Capital & Production Facility Expansion (₹ lakh)",
            loanTenure="36 Months",
            overallRecommendation=decision,
            reportGenerationDate=today_str,
            borrowerRating=rating_map[risk_level],
        ),
        keyFinancialHighlights=FinancialHighlightsSection(
            liquidityPosition=f"Current Ratio {SYNTHETIC_INDIAN_COMPANY['current_ratio']:.2f}x",
            treasuryHealth="NSFR 118.2% | Cash Coverage 3.0 Months",
            revenueTrend=f"Annual Revenue ₹{SYNTHETIC_INDIAN_COMPANY['annual_revenue']:.0f} lakh",
            profitability=f"EBITDA Margin {SYNTHETIC_INDIAN_COMPANY['ebitda_margin_pct']:.1f}% | Net Margin {SYNTHETIC_INDIAN_COMPANY['net_profit_margin_pct']:.1f}%",
            cashFlow=f"Annual Operating Cash Flow ₹{SYNTHETIC_INDIAN_COMPANY['annual_operating_cash_flow']:.0f} lakh",
            debtPosition=f"Total Debt ₹{SYNTHETIC_INDIAN_COMPANY['total_debt']:.0f} lakh | D/E {de:.2f}x",
            strengths=strengths,
            weaknesses=weaknesses,
        ),
        macroIndustryOutlook=MacroIndustryOutlookSection(
            gdpOutlook="India GDP growth +6.8% annually",
            inflation="CPI stabilizing at 4.8%",
            interestRateEnvironment="RBI Benchmark Repo Rate at 6.50%",
            industryGrowth="Core Industrial growth +8.5% YoY",
            countryRisk="Moderate — BBB- sovereign rating (Stable)",
            aiInterpretation="Stable macro backdrop with sustained domestic infrastructure demand supporting credit capacity.",
        ),
        marketFXRiskSummary=MarketFXRiskSummarySection(
            var95=f"₹{(raw_amt * 0.015):.2f} lakh",
            expectedShortfall=f"₹{(raw_amt * 0.022):.2f} lakh",
            fxExposure=f"₹{(raw_amt * 0.40):.2f} lakh",
            hedgedVsUnhedged="78% Hedged / 22% Unhedged",
            tailRisk="Controlled (Tail Risk Ratio 1.48)",
            overallMarketRiskConclusion="Market and FX risks are within institutional limits under standard rate shocks.",
        ),
        creditRiskSummary=CreditRiskSummarySection(
            creditRating=rating_map[risk_level].split(" ")[0],
            existingDebt=f"₹{SYNTHETIC_INDIAN_COMPANY['total_debt']:.0f} lakh",
            debtRatios=[
                {"name": "Debt-to-Equity", "value": f"{de:.2f}x"},
                {"name": "EBITDA Interest Coverage", "value": f"{cov:.2f}x"},
                {"name": "Current Ratio", "value": f"{SYNTHETIC_INDIAN_COMPANY['current_ratio']:.2f}x"},
            ],
            repaymentBehaviour="Historically satisfactory with regular debt service track record.",
            defaultHistory="Clean institutional credit record.",
            primaryStrengths=strengths[:2],
            primaryConcerns=weaknesses[:2],
        ),
        riskAggregation=RiskAggregationRecommendationSection(
            overallRiskScore=score,
            overallRiskLevel=risk_level,
            confidenceScore=94.2,
            recommendedDecision=decision,
            triggeredRule="Credit Committee Policy #CR-402 (Leverage & Coverage Thresholds)",
        ),
        keyInsights=[
            f"{SYNTHETIC_DATA_LABEL}",
            f"Underwriting model assigned {risk_level} risk standing (score {score:.1f}/100).",
            f"Requested facility of {exp_str} evaluated with 36-month amortization.",
            f"Human review {'required' if risk_level != 'Low' else 'optional'} under bank risk policy.",
        ] + ([officer_signoff] if officer_signoff else []),
        conditions=ConditionsSection(
            isConditional=decision == "APPROVE WITH CONDITIONS",
            isRejected=decision == "REJECT",
            requiredCollateral=[
                "First lien pari-passu charge over unencumbered plant and machinery.",
                "Corporate guarantee from primary operating promoters.",
            ],
            financialCovenants=[
                f"Minimum EBITDA Interest Coverage >= 3.0x tested semi-annually.",
                f"Maximum Debt-to-Equity <= 1.25x.",
            ],
            monitoringRequirements=[
                "Quarterly unaudited financial statements within 45 days.",
                "Annual audited statements within 90 days.",
            ],
            rejectionReasons=[] if decision != "REJECT" else ["Breach of maximum leverage ceiling."],
        ),
        aiExplainabilityNarrative=(
            f"{SYNTHETIC_DATA_LABEL} The quantitative loan evaluation framework for {company_name} synthesized "
            f"audited financials (Revenue: ₹{SYNTHETIC_INDIAN_COMPANY['annual_revenue']} lakh, EBITDA: ₹{SYNTHETIC_INDIAN_COMPANY['ebitda']} lakh, "
            f"Interest Coverage: {cov}x), treasury liquidity (Cash coverage: 3.0 months), and macroeconomic trends. "
            f"The final composite score of {score:.1f} places the company in the {risk_level} risk bracket. "
            f"The underwriting engine advises {decision} with structured covenant tracking."
        ),
        disclaimer=(
            f"{SYNTHETIC_DATA_LABEL} CONFIDENTIAL — This credit assessment is generated for authorized banking officers "
            "of the institutional credit committee. All automated evaluations constitute advisory decision support and require formal committee sign-off."
        ),
    )

    return build_success_response(report.model_dump())
