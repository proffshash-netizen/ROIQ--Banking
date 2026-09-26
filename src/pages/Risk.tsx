import { useState } from "react";
import {
  useCreditRisk,
  MarketRiskChartsWidget,
  CreditRiskChartsWidget,
  ExecutiveSummaryWidget,
  CreditRiskStatementsWidget,
  LoadingSkeleton,
} from "@/modules/credit-risk";
import {
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Check,
  Clock,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { useCompaniesStore } from "@/stores/companiesStore";

export function Risk() {
  const {
    marketRisk, creditRisk, executiveSummary,
    loading, analyzing, error, analysisResult,
    analyzeRisk, submitReview, retry,
  } = useCreditRisk();

  const activeCompany = useCompaniesStore(state =>
    state.companies.find(c => c.id === state.selectedCompanyId) ?? state.companies[0]
  );

  const [officerNotes, setOfficerNotes] = useState(
    "Facility authorized subject to maintenance of 1.35x DSCR covenant and senior secured pledge over operating assets."
  );
  const [overrideMode, setOverrideMode] = useState(false);
  const [adjustedCategory, setAdjustedCategory] = useState<string>("Medium");

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto py-6">
        <div className="bank-panel p-4 flex items-center justify-between gap-4" style={{ borderColor: "#F0BABA", background: "#FBE8E8" }}>
          <div className="flex items-center gap-2 text-[#C74646]">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">Error loading credit risk data: {error}</span>
          </div>
          <button className="btn-secondary text-xs" onClick={retry}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const isPaused = analysisResult?.workflow_status === "PAUSED_FOR_APPROVAL";
  const isCompleted = analysisResult?.workflow_status === "COMPLETED";
  const creditScore = analysisResult?.credit_score ?? activeCompany?.creditScore ?? 68;
  const rawRisk = analysisResult?.risk_category ?? (creditScore >= 75 ? "Low" : creditScore >= 55 ? "Medium" : "High");
  const riskCategory = rawRisk.charAt(0).toUpperCase() + rawRisk.slice(1).toLowerCase();

  const riskBadge = (cat: string) => {
    if (cat === "Low")      return "badge-low"
    if (cat === "Medium")   return "badge-medium"
    if (cat === "High")     return "badge-high"
    if (cat === "Critical") return "badge-critical"
    return "badge-pending"
  }

  const revenue = activeCompany?.revenue || "₹2,43,353 Cr"
  const ebitda  = activeCompany?.ebitda  || "₹32,800 Cr"
  const debt    = activeCompany?.debt    || "₹85,000 Cr"
  const cash    = activeCompany?.cash    || "₹28,000 Cr"

  const indicators = [
    { label: "Debt / Equity",       value: "1.82x", threshold: "< 2.50x", pass: true },
    { label: "DSCR",                value: "1.46x", threshold: "> 1.30x", pass: true },
    { label: "Interest Coverage",   value: "3.2x",  threshold: "> 3.00x", pass: true },
    { label: "Debt / EBITDA",       value: "2.8x",  threshold: "< 3.50x", pass: true },
  ]

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">

      {/* ── Breadcrumb ── */}
      <nav className="bank-breadcrumb">
        <span>Home</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span>Credit Risk</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span className="text-[#172033] font-medium">{activeCompany?.name}</span>
      </nav>

      {/* ── Section 1: Entity Header ── */}
      <div className="bank-panel">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#5F6F85] mb-1">
              Credit analyst workstation · Ref: REF-00{activeCompany?.id}
            </div>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <h1 className="text-2xl font-bold text-[#172033]">{activeCompany?.name}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded border border-[#D9E1EA] bg-[#F5F7FA] text-[#5F6F85] font-medium">
                {activeCompany?.sector}
              </span>
              <span className={riskBadge(riskCategory)}>{riskCategory} Risk</span>
              <span className="text-[11px] font-bold text-[#172033] px-2 py-0.5 bg-[#F0F4F9] border border-[#D9E1EA] rounded">
                Score: {creditScore} / 100
              </span>
            </div>
          </div>
          <button
            onClick={() => analyzeRisk()}
            disabled={analyzing}
            className="btn-primary shrink-0"
          >
            {analyzing
              ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Evaluating credit risk...</>
              : <><ShieldCheck className="h-3.5 w-3.5" /> Assess Credit Risk</>
            }
          </button>
        </div>
      </div>

      {/* ── Section 2: Credit Workflow Pipeline ── */}
      <div className="bank-panel">
        <div className="bank-panel-header">
          <span className="bank-h3">Credit Workflow Pipeline</span>
          <span className="text-[11px] text-[#5F6F85]">
            Status: <strong className="text-[#172033]">{analysisResult?.workflow_status || "Ready for analysis"}</strong>
          </span>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { step: "1", label: "Financial Data",  done: true,           active: false, warn: false },
            { step: "2", label: "Risk Evaluation", done: !!analysisResult,active: analyzing, warn: false },
            { step: "3", label: "Credit Review",   done: isCompleted,    active: isPaused,  warn: isPaused },
            { step: "4", label: "Recommendation",  done: isCompleted,    active: false, warn: false },
          ].map(s => (
            <div
              key={s.step}
              className={`flex items-center gap-3 p-3 rounded border text-[13px] ${
                s.warn     ? "border-[#F0D790] bg-[#FDF4E3]" :
                s.done     ? "border-[#B8DDD0] bg-[#E8F5EF]" :
                             "border-[#D9E1EA] bg-[#F8FAFC]"
              }`}
            >
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                s.done ? "bg-[#238B5B] text-white" :
                s.warn ? "bg-[#C98A16] text-white" :
                         "bg-[#D9E1EA] text-[#5F6F85]"
              }`}>
                {s.done && !s.warn  ? <Check className="h-3.5 w-3.5 stroke-[3]" /> :
                 s.warn             ? <Clock className="h-3.5 w-3.5" /> :
                                      s.step}
              </div>
              <div>
                <p className="font-semibold text-[#172033] leading-tight">{s.step}. {s.label}</p>
                <p className={`text-[11px] mt-0.5 ${
                  s.done && !s.warn ? "text-[#238B5B]" :
                  s.warn ? "text-[#C98A16]" : "text-[#5F6F85]"
                }`}>
                  {s.done && !s.warn ? "✓ Complete" :
                   s.warn ? "● Awaiting officer decision" : "○ Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Financial Position + Risk Score ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Financial Position */}
        <div className="lg:col-span-5 bank-panel">
          <div className="bank-panel-header">
            <h2 className="bank-h3">Financial Position</h2>
            <span className="text-[11px] text-[#5F6F85]">Latest audited figures</span>
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {[
                { label: "Revenue",              value: revenue },
                { label: "EBITDA",               value: ebitda },
                { label: "Total Debt",           value: debt },
                { label: "Cash & Equivalents",   value: cash },
                { label: "Operating Cash Flow",  value: "₹29,400 Cr" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-[#EBF0F7] last:border-0 hover:bg-[#F5F7FA]">
                  <td className="py-2.5 px-4 text-[#5F6F85] font-medium">{r.label}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#172033]" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {r.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Score + Indicators */}
        <div className="lg:col-span-7 space-y-4">

          {/* Credit Risk Score */}
          <div className="bank-panel">
            <div className="bank-panel-header">
              <h2 className="bank-h3">Credit Risk Score</h2>
              <span className={riskBadge(riskCategory)}>{riskCategory} Risk</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#172033]">{creditScore}</span>
                <span className="text-lg text-[#5F6F85]">/ 100</span>
              </div>
              {/* Score bar */}
              <div className="space-y-1">
                <div className="h-3 w-full rounded border border-[#D9E1EA] overflow-hidden flex">
                  <div className="h-full bg-[#238B5B]" style={{ width: "40%" }} title="Low (0–40)" />
                  <div className="h-full bg-[#1E4FA3]" style={{ width: "30%" }} title="Medium (40–70)" />
                  <div className="h-full bg-[#C98A16]" style={{ width: "15%" }} title="High (70–85)" />
                  <div className="h-full bg-[#C74646]" style={{ width: "15%" }} title="Critical (85–100)" />
                </div>
                {/* Score marker */}
                <div className="relative h-2">
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-[#172033]"
                    style={{ left: `${creditScore}%`, transform: "translateX(-50%)" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#5F6F85]">
                  <span>0 (Prime)</span><span>40</span><span>70</span><span>85</span><span>100 (Default)</span>
                </div>
              </div>
              <p className="text-[12px] text-[#5F6F85]">
                Statistical credit risk assessment based on leverage, debt servicing capacity, cash flow adequacy, and market exposure.
              </p>
            </div>
          </div>

          {/* Credit Risk Indicators */}
          <div className="bank-panel">
            <div className="bank-panel-header">
              <h2 className="bank-h3">Credit Risk Indicators</h2>
              <span className="text-[11px] text-[#5F6F85]">Policy thresholds</span>
            </div>
            <div className="overflow-x-auto">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Indicator</th>
                    <th className="text-right">Value</th>
                    <th className="text-right">Policy Threshold</th>
                    <th className="text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map(m => (
                    <tr key={m.label}>
                      <td className="font-medium">{m.label}</td>
                      <td className="text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</td>
                      <td className="text-right text-[#5F6F85]" style={{ fontVariantNumeric: "tabular-nums" }}>{m.threshold}</td>
                      <td className="text-right pr-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#238B5B]">
                          <CheckCircle2 className="h-3 w-3" /> Compliant
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── Section 4: Risk Drivers ── */}
      <div className="bank-panel">
        <div className="bank-panel-header">
          <h2 className="bank-h3">Risk Drivers</h2>
          <span className="text-[11px] text-[#5F6F85]">Rationale for score {creditScore}</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          {/* Risk Factors */}
          <div className="rounded border border-[#F0BABA] bg-[#FBE8E8] p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#C74646]">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Factors</span>
            </div>
            <ul className="space-y-1.5 text-[#172033] list-disc list-inside leading-relaxed">
              {analysisResult?.risk_factors?.length ? (
                analysisResult.risk_factors.map((f, i) => <li key={i}>{f}</li>)
              ) : (
                <>
                  <li>Elevated leverage relative to historical operating cycle.</li>
                  <li>Moderate debt servicing capacity with planned capital expenditures.</li>
                  <li>Working capital requirements expanded across recent quarters.</li>
                </>
              )}
            </ul>
          </div>
          {/* Positive Factors */}
          <div className="rounded border border-[#B8DDD0] bg-[#E8F5EF] p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#238B5B]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Positive Factors</span>
            </div>
            <ul className="space-y-1.5 text-[#172033] list-disc list-inside leading-relaxed">
              {analysisResult?.positive_factors?.length ? (
                analysisResult.positive_factors.map((f, i) => <li key={i}>{f}</li>)
              ) : (
                <>
                  <li>Consistent revenue growth backed by strong enterprise market position.</li>
                  <li>Strong operating margins providing baseline downside protection.</li>
                  <li>Stable operating cash flow supporting ongoing interest obligations.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 5: Credit Officer Review ── */}
      <div className="bank-panel">
        <div className="bank-panel-header">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-[#1E4FA3]" />
            <h2 className="bank-h3">Credit Officer Review</h2>
          </div>
          <span className="text-[11px] text-[#5F6F85]">Approval desk</span>
        </div>
        <div className="p-4 space-y-4">

          {/* Context strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded border border-[#D9E1EA] bg-[#F5F7FA] text-[13px]">
            {[
              { label: "Company",          value: activeCompany?.name },
              { label: "Risk Category",    value: riskCategory },
              { label: "Credit Score",     value: `${creditScore} / 100` },
              { label: "Requested Facility", value: activeCompany?.loanExposure },
            ].map((f, i) => (
              <div key={i}>
                <span className="bank-label block">{f.label}</span>
                <span className="font-semibold text-[#172033] mt-0.5 block">{f.value}</span>
              </div>
            ))}
          </div>

          {/* Decision Notes */}
          <div className="space-y-1.5">
            <label className="bank-label block">Decision Notes & Conditions</label>
            <textarea
              rows={3}
              value={officerNotes}
              onChange={e => setOfficerNotes(e.target.value)}
              placeholder="Record approval conditions, risk mitigation terms, or rationale..."
              className="bank-input resize-none"
            />
          </div>

          {/* Override panel */}
          {overrideMode && (
            <div className="p-3 rounded border border-[#F0D790] bg-[#FDF4E3] space-y-2">
              <div className="flex items-center gap-2 text-[#C98A16] font-semibold text-[13px]">
                <SlidersHorizontal className="h-4 w-4" />
                Risk Category Override
              </div>
              <p className="text-[12px] text-[#5F6F85]">
                Override standard model categorization based on mitigating covenants or collateral.
              </p>
              <select
                value={adjustedCategory}
                onChange={e => setAdjustedCategory(e.target.value)}
                className="bank-input w-auto"
              >
                <option value="Low">Override to: Low Risk</option>
                <option value="Medium">Override to: Medium Risk</option>
                <option value="High">Override to: High Risk</option>
                <option value="Critical">Override to: Critical</option>
              </select>
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D9E1EA]">
            <div className="flex items-center gap-2">
              <button
                className="btn-primary"
                disabled={analyzing}
                onClick={() => submitReview({ approved: true, notes: officerNotes, adjusted_category: overrideMode ? adjustedCategory : riskCategory, officer: "Senior Credit Officer" })}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                className="btn-danger"
                disabled={analyzing}
                onClick={() => submitReview({ approved: false, notes: officerNotes, officer: "Senior Credit Officer" })}
              >
                <XCircle className="h-3.5 w-3.5" /> Decline
              </button>
              <button
                className="btn-secondary"
                onClick={() => setOverrideMode(!overrideMode)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {overrideMode ? "Cancel Override" : "Override"}
              </button>
            </div>
            {analysisResult?.human_approval && (
              <span className="text-[12px] text-[#238B5B] font-semibold flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                Decision recorded by {analysisResult.human_approval.officer || "Senior Credit Officer"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 6: Final Recommendation (when complete) ── */}
      {isCompleted && analysisResult?.recommendation && (
        <div className="bank-panel" style={{ borderColor: "#B8DDD0" }}>
          <div className="bank-panel-header" style={{ background: "#E8F5EF", borderColor: "#B8DDD0" }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#238B5B]" />
              <h2 className="bank-h3">Loan Recommendation</h2>
            </div>
          </div>
          <div className="p-4 space-y-4 text-[13px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 rounded border border-[#D9E1EA] bg-[#F5F7FA]">
              {[
                { label: "Requested Amount", value: `$${(analysisResult.recommendation.requested_amount / 1_000_000).toFixed(0)}M`, cls: "text-[#172033]" },
                { label: "Recommended Limit", value: `$${(analysisResult.recommendation.approved_amount / 1_000_000).toFixed(0)}M`, cls: "text-[#238B5B]" },
                { label: "Tenor", value: `${analysisResult.recommendation.tenure_months || 36} months`, cls: "text-[#172033]" },
                { label: "Pricing Spread", value: analysisResult.recommendation.pricing_spread, cls: "text-[#172033]" },
              ].map((f, i) => (
                <div key={i}>
                  <span className="bank-label block">{f.label}</span>
                  <span className={`font-bold text-base mt-0.5 block ${f.cls}`}>{f.value}</span>
                </div>
              ))}
            </div>
            {analysisResult.recommendation.covenants?.length > 0 && (
              <div className="space-y-1.5">
                <span className="bank-label block">Approved Covenants & Conditions</span>
                <ul className="space-y-1 text-[#5F6F85] list-decimal list-inside">
                  {analysisResult.recommendation.covenants.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section 7: Supporting Widgets ── */}
      {executiveSummary && <ExecutiveSummaryWidget data={executiveSummary} />}
      {marketRisk && creditRisk && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarketRiskChartsWidget data={marketRisk} />
          <CreditRiskChartsWidget data={creditRisk} />
        </div>
      )}
      {marketRisk && creditRisk && executiveSummary && (
        <CreditRiskStatementsWidget marketRisk={marketRisk} creditRisk={creditRisk} executiveSummary={executiveSummary} />
      )}
    </div>
  );
}

export default Risk;
