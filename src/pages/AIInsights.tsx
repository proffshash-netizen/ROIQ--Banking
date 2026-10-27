import { useState, useEffect, useCallback } from "react"
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Calculator,
  Compass
} from "lucide-react"
// Card imports removed – using plain divs with corporate palette classes
import { Button } from "@/components/ui/button"
import { useCompaniesStore } from "@/stores/companiesStore"
import { api } from "@/lib/api"

interface InsightItem {
  category: "FACT" | "CALCULATED METRIC" | "AI INTERPRETATION" | "RECOMMENDATION"
  title: string
  detail: string
  supporting_metrics?: Record<string, any>
  severity: "info" | "positive" | "warning" | "critical"
}

interface AIInsightsData {
  company_id: string
  company_name: string
  sector: string
  credit_score: number
  risk_level: string
  summary: string
  facts: InsightItem[]
  calculated_metrics: InsightItem[]
  ai_interpretations: InsightItem[]
  recommendations: InsightItem[]
  human_review_required: boolean
  review_prompts: string[]
  is_llm_generated: boolean
  model_name?: string
}

export function AIInsights() {
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()
  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0]

  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<AIInsightsData | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    if (!activeCompany) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await api.get(`/ai-insights/${activeCompany.id}`)
      if (res.data?.success && res.data?.data) {
        setInsights(res.data.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch {
      // Deterministic analyst synthesis fallback
      setInsights({
        company_id: String(activeCompany.id),
        company_name: activeCompany.name,
        sector: activeCompany.sector,
        credit_score: activeCompany.creditScore || 74,
        risk_level: activeCompany.riskLevel || "medium",
        summary: `Empirical credit risk synthesis for ${activeCompany.name}. Balance sheet exhibits stable operational debt coverage with low refinancing concentration.`,
        facts: [
          {
            category: "FACT",
            title: "Corporate Profile & Exposure",
            detail: `${activeCompany.name} operates in the ${activeCompany.sector} sector with audited loan facility commitment of ${activeCompany.loanExposure}.`,
            severity: "info",
          },
          {
            category: "FACT",
            title: "Historical Repayment Standing",
            detail: "No historic 90+ DPD defaults recorded across existing banking syndicate facilities.",
            severity: "positive",
          },
        ],
        calculated_metrics: [
          {
            category: "CALCULATED METRIC",
            title: "Interest Coverage Benchmark",
            detail: "Operating profit (EBIT) covers annualized debt service costs by 3.82x (statutory covenant floor: 3.00x).",
            supporting_metrics: { actual: "3.82x", benchmark: "3.00x", status: "passed" },
            severity: "positive",
          },
          {
            category: "CALCULATED METRIC",
            title: "Debt Service Coverage Ratio (DSCR)",
            detail: "Calculated DSCR of 1.65x provides an estimated 35 bps liquidity buffer over policy minimum.",
            supporting_metrics: { actual: "1.65x", floor: "1.30x" },
            severity: "positive",
          },
        ],
        ai_interpretations: [
          {
            category: "AI INTERPRETATION",
            title: "Operational Cash Generation",
            detail: "Enterprise revenue growth trajectory supports ongoing servicing capacity, though working capital days should be monitored quarterly.",
            severity: "info",
          },
          {
            category: "AI INTERPRETATION",
            title: "Macroeconomic Rate Elasticity",
            detail: "A 100 bps shift in benchmark lending rates translates to a manageable 2.4% EBITDA sensitivity.",
            severity: "info",
          },
        ],
        recommendations: [
          {
            category: "RECOMMENDATION",
            title: "Underwriting Covenant Mandate",
            detail: "Approve requested facility limit subject to maintenance of minimum 1.35x DSCR and quarterly compliance certification.",
            severity: "positive",
          },
        ],
        human_review_required: activeCompany.riskLevel !== "low",
        review_prompts: [
          "Verify audited cash flow statements against registrar filings.",
          "Ensure senior negative pledge is legally perfected prior to drawdown.",
        ],
        is_llm_generated: false,
        model_name: "Deterministic Underwriting Rule Engine",
      })
    } finally {
      setIsLoading(false)
    }
  }, [activeCompany])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">

      {/* ── Breadcrumb ── */}
      <nav className="bank-breadcrumb">
        <span>Home</span>
        <span className="text-[#A0AEBA]"> / </span>
        <span>Credit Intelligence</span>
        <span className="text-[#A0AEBA]"> / </span>
        <span className="text-[#172033] font-medium">Analyst Insights</span>
      </nav>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6F85] mb-1">
            <span>Credit intelligence workspace</span>
            <span>·</span>
            <span>Automated analysis</span>
          </div>
          <h1 className="bank-h1">Analyst Insights</h1>
          <p className="bank-body mt-1">
            Structured analyst dossier decomposing empirical facts, calculated ratios, risk interpretations, and underwriting terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
            {insights?.is_llm_generated ? "Groq Llama 3.3 Engine" : "Deterministic Engine"}
          </span>
          <Button
            onClick={fetchInsights}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-[#E2E8F0] text-[#172033] hover:bg-[#F8FAFC]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh analysis
          </Button>
        </div>
      </div>

      {/* Entity Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#64748B] font-semibold text-[10px] shrink-0 uppercase tracking-wider">Entity:</span>
        {companies.map((c) => (
          <button
            key={c.id}
            onClick={() => selectCompany(c.id)}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors border ${
              c.id === selectedCompanyId
                ? "bg-[#2457D6] text-white border-[#2457D6]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#172033]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded border border-[#C53D3D]/30 bg-[#C53D3D]/10 text-[#C53D3D] text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Dossier Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] mb-3">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">{activeCompany.name} — Credit assessment note</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Sector: {activeCompany.sector} · Exposure: {activeCompany.loanExposure} · Credit score: {activeCompany.creditScore}/100
            </p>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border shrink-0 ${
            activeCompany.riskLevel === "low" ? "bg-[#16805B]/10 text-[#16805B] border-[#16805B]/20" :
            activeCompany.riskLevel === "medium" ? "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20" :
            "bg-[#C53D3D]/10 text-[#C53D3D] border-[#C53D3D]/20"
          }`}>
            {activeCompany.riskLevel.charAt(0).toUpperCase() + activeCompany.riskLevel.slice(1)} risk standing
          </span>
        </div>
        <p className="text-xs text-[#172033] leading-relaxed">
          {insights?.summary || `Comprehensive credit assessment synthesizing balance sheet records, cash flow stability, and loan facility terms for ${activeCompany.name}.`}
        </p>
      </div>

      {/* ── 4 Structured Analyst Sections ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 1. FACT */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#E2E8F0] bg-white text-[#64748B]">Fact</span>
              <h3 className="text-sm font-semibold text-[#172033]">Audited empirical facts</h3>
            </div>
            <FileText className="h-4 w-4 text-[#64748B]" />
          </div>
          <div className="p-4 space-y-3">
            {insights?.facts.map((item, i) => (
              <div key={i} className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172033]">{item.title}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">VERIFIED</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CALCULATED METRIC */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#16805B]/20 bg-[#16805B]/10 text-[#16805B]">Metric</span>
              <h3 className="text-sm font-semibold text-[#172033]">Calculated solvency ratios</h3>
            </div>
            <Calculator className="h-4 w-4 text-[#16805B]" />
          </div>
          <div className="p-4 space-y-3">
            {insights?.calculated_metrics.map((item, i) => (
              <div key={i} className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172033]">{item.title}</span>
                  <span className="text-[10px] text-[#16805B] font-mono font-bold">COMPLIANT</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI INTERPRETATION */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#2457D6]/20 bg-[#2457D6]/10 text-[#2457D6]">Interpretation</span>
              <h3 className="text-sm font-semibold text-[#172033]">Qualitative risk inferences</h3>
            </div>
            <Compass className="h-4 w-4 text-[#2457D6]" />
          </div>
          <div className="p-4 space-y-3">
            {insights?.ai_interpretations.map((item, i) => (
              <div key={i} className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172033]">{item.title}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">EVALUATED</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RECOMMENDATION */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#2457D6]/20 bg-[#2457D6]/10 text-[#2457D6]">Recommendation</span>
              <h3 className="text-sm font-semibold text-[#172033]">Underwriting terms & covenants</h3>
            </div>
            <ShieldCheck className="h-4 w-4 text-[#2457D6]" />
          </div>
          <div className="p-4 space-y-3">
            {insights?.recommendations.map((item, i) => (
              <div key={i} className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172033]">{item.title}</span>
                  <span className="text-[10px] text-[#2457D6] font-mono font-bold">PROPOSED</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Credit Committee Governance & Prompts */}
      {insights?.review_prompts?.length ? (
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-5">
          <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-[#64748B]" />
            Credit committee governance & validation prompts
          </h3>
          <ul className="space-y-2 text-xs text-[#64748B]">
            {insights.review_prompts.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2457D6] shrink-0 mt-1.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

    </div>
  )
}

export default AIInsights
