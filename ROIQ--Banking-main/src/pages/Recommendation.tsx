import {
  useLoanRecommendation,
  LoadingSkeleton,
} from "@/modules/loan-recommendation";
import { Button } from "@/components/ui/button";
// Card imports removed – using plain corporate-styled divs
import {
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Printer
} from "lucide-react";
import { useCompaniesStore } from "@/stores/companiesStore";

export function Recommendation() {
  const { data, loading, error, retry } = useLoanRecommendation();
  const activeCompany = useCompaniesStore((state) =>
    state.companies.find((c) => c.id === state.selectedCompanyId) ?? state.companies[0]
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Error Loading Loan Recommendation</h3>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs">{error || "No recommendation data available."}</span>
            <Button variant="outline" size="sm" onClick={retry} className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const decision = data.creditDecision;
  const explain = data.explainability;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-16">

      {/* ── Top Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Credit committee underwriting sheet</span>
            <span>·</span>
            <span className="font-mono">Ref: REC-{activeCompany.id}089</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033] leading-tight">
            Loan Recommendation
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Institutional term sheet, approved facility parameters, covenant constraints, and underwriting rationale.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs gap-1.5 border-[#E2E8F0] text-[#172033] hover:bg-[#F8FAFC]"
          >
            <Printer className="h-3.5 w-3.5 text-[#64748B]" />
            Print term sheet
          </Button>
          <Button
            onClick={retry}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-[#E2E8F0] text-[#172033] hover:bg-[#F8FAFC]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#64748B]" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Recommendation Document Container ── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Document Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider block mb-0.5">Applicant entity</span>
            <h2 className="text-xl font-bold text-[#172033]">{activeCompany.name}</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Sector: {activeCompany.sector} · HQ: {activeCompany.hq}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-0.5">Decision outcome</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${
                decision.decision === "APPROVE" ? "bg-[#16805B]/10 text-[#16805B] border-[#16805B]/20" :
                decision.decision === "APPROVE WITH CONDITIONS" ? "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20" :
                "bg-[#C53D3D]/10 text-[#C53D3D] border-[#C53D3D]/20"
              }`}>
                {decision.decision === "APPROVE" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {decision.decision}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* 1. Core Recommended Facility Terms Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              1. Recommended facility terms & pricing
            </h3>
            <div className="overflow-x-auto border border-[#E2E8F0] rounded">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-[#F1F5F9]">
                  <tr className="bg-white hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#64748B] w-1/4">Requested amount</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033] w-1/4">{activeCompany.loanExposure}</td>
                    <td className="py-2.5 px-4 font-medium text-[#64748B] w-1/4">Recommended amount</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#16805B] w-1/4">{activeCompany.loanExposure}</td>
                  </tr>
                  <tr className="bg-white hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Pricing structure / spread</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033]">{decision.suggestedInterestRateBand}</td>
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Facility tenor</td>
                    <td className="py-2.5 px-4 font-mono text-[#172033]">5 Years (Amortizing)</td>
                  </tr>
                  <tr className="bg-white hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Evaluated risk score</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033]">{decision.overallRiskScore} / 100</td>
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Risk category</td>
                    <td className="py-2.5 px-4 font-semibold text-[#172033]">{decision.riskCategory} risk tier</td>
                  </tr>
                  <tr className="bg-white hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Model confidence</td>
                    <td className="py-2.5 px-4 font-mono text-[#172033]">{decision.confidenceScore}% (High Certainty)</td>
                    <td className="py-2.5 px-4 font-medium text-[#64748B]">Monitoring frequency</td>
                    <td className="py-2.5 px-4 text-[#172033]">{decision.suggestedMonitoringFrequency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Collateral & Pre-Drawdown Conditions */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              2. Collateral requirements & pre-drawdown conditions
            </h3>
            <div className="p-4 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#172033] font-semibold">
                <ShieldCheck className="h-4 w-4 text-[#2457D6]" />
                <span>Security / Collateral pledge:</span>
              </div>
              <p className="text-[#64748B] pl-6">
                {decision.suggestedCollateralRequirement}
              </p>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#172033] block mb-1">Mandatory conditions precedent:</span>
                <ul className="list-disc list-inside space-y-1 text-[#64748B] pl-2">
                  {(explain.recommendedLoanConditions || []).map((cond: string, i: number) => (
                    <li key={i}>{cond}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Mandatory Covenants Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              3. Operational & financial covenants
            </h3>
            <div className="overflow-x-auto border border-[#E2E8F0] rounded">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-2.5 px-4 text-left font-semibold">Covenant name</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Requirement threshold</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Verification frequency</th>
                    <th className="py-2.5 px-4 text-center font-semibold">Remedy period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#172033]">Debt service coverage (DSCR)</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033]">≥ 1.35x</td>
                    <td className="py-2.5 px-4 text-[#64748B]">Quarterly compliance certificate</td>
                    <td className="py-2.5 px-4 text-center font-mono text-[#64748B]">30 days</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#172033]">Total debt / tangible net worth</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033]">≤ 2.50x</td>
                    <td className="py-2.5 px-4 text-[#64748B]">Semi-annual audited reports</td>
                    <td className="py-2.5 px-4 text-center font-mono text-[#64748B]">45 days</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4 font-medium text-[#172033]">Minimum liquidity floor</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#172033]">≥ $25.0M Unencumbered Cash</td>
                    <td className="py-2.5 px-4 text-[#64748B]">Monthly treasury report</td>
                    <td className="py-2.5 px-4 text-center font-mono text-[#64748B]">15 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Underwriting Rationale & Risk Factor Decomposition */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              4. Credit officer rationale & risk analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded border border-[#16805B]/20 bg-[#16805B]/5 space-y-1.5">
                <span className="font-semibold text-[#16805B] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Mitigating factors supporting approval:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#64748B] pl-1">
                  {explain.topPositiveFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded border border-[#B7791F]/20 bg-[#B7791F]/5 space-y-1.5">
                <span className="font-semibold text-[#B7791F] flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Risk drivers requiring surveillance:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#64748B] pl-1">
                  {explain.primaryRiskDrivers.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#172033] leading-relaxed">
              <strong>Business justification:</strong> {explain.businessJustification}
            </div>
          </div>

          {/* 5. Sign-off & Audit Block */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#64748B]">
            <div>
              <p>Underwriting System: <strong className="text-[#172033]">ROIQ Underwriting Core v2.4</strong></p>
              <p className="text-[11px] font-mono">Triggered Logic: {decision.triggeredRule}</p>
            </div>
            <div className="text-right font-mono text-[11px]">
              <p>Audit Hash: SHA256:7f3a9e...4b12</p>
              <p>Status: CERTIFIED FOR REVIEW</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Recommendation;
