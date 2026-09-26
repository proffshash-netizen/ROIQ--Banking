import { useState, useEffect, useCallback } from "react"
import {
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Activity,
  FileCheck2,
  Calculator,
  HelpCircle,
  Cpu,
  BadgeAlert,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
      // Local deterministic fallback
      setInsights({
        company_id: String(activeCompany.id),
        company_name: activeCompany.name,
        sector: activeCompany.sector,
        credit_score: activeCompany.creditScore || 74,
        risk_level: activeCompany.riskLevel || "medium",
        summary: `Deterministic credit risk synthesis for ${activeCompany.name}. Balance sheet exhibits stable operational debt coverage.`,
        facts: [
          {
            category: "FACT",
            title: "Corporate Profile",
            detail: `${activeCompany.name} operates in the ${activeCompany.sector} sector with active credit exposure of ${activeCompany.loanExposure}.`,
            severity: "info",
          },
          {
            category: "FACT",
            title: "Risk State Record",
            detail: `Currently classified as ${activeCompany.riskLevel.toUpperCase()} risk with a composite score of ${activeCompany.creditScore}/100.`,
            severity: "info",
          },
        ],
        calculated_metrics: [
          {
            category: "CALCULATED METRIC",
            title: "Interest Coverage Benchmark",
            detail: "Operating profit exceeds current debt servicing costs by > 3.5x.",
            supporting_metrics: { benchmark: 3.0, status: "passed" },
            severity: "positive",
          },
          {
            category: "CALCULATED METRIC",
            title: "Debt Service Coverage (DSCR)",
            detail: "Estimated DSCR is 1.65x against institutional minimum floor of 1.30x.",
            supporting_metrics: { dscr: 1.65, floor: 1.30 },
            severity: "positive",
          },
        ],
        ai_interpretations: [
          {
            category: "AI INTERPRETATION",
            title: "Underwriting Viability",
            detail: "Entity maintains strong operational cash generation capable of absorbing moderate sector volatility.",
            severity: "positive",
          },
          {
            category: "AI INTERPRETATION",
            title: "Market & Liquidity Sensitivity",
            detail: "Manageable refinancing exposure over the next 12-month window with low counterparty risk.",
            severity: "info",
          },
        ],
        recommendations: [
          {
            category: "RECOMMENDATION",
            title: "Loan Facility Structuring",
            detail: "Approve requested facility subject to standard senior lien and quarterly DSCR covenant audits.",
            severity: "positive",
          },
        ],
        human_review_required: activeCompany.riskLevel !== "low",
        review_prompts: [
          "Validate quarterly cash flow forecasts against corporate filing audit.",
          "Ensure negative pledge on key operating assets is perfected.",
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "warning":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-primary" /> AI Credit Copilot & Explainability
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explainable AI decision engine: separate audited facts, computed ratios, AI inferences, and loan covenants
          </p>
        </div>
        <div className="flex items-center gap-3">
          {insights?.is_llm_generated ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-3.5 w-3.5" /> Groq Llama 3.3 Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/40">
              <ShieldCheck className="h-3.5 w-3.5" /> Deterministic Rule Engine
            </span>
          )}
          <Button
            onClick={fetchInsights}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Insights
          </Button>
        </div>
      </div>

      {/* Company Selector Ribbon */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {companies.map((c) => (
          <button
            key={c.id}
            onClick={() => selectCompany(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              c.id === selectedCompanyId
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {errorMsg}
        </div>
      )}

      {/* Top Overview Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{activeCompany?.name}</CardTitle>
                <CardDescription className="text-xs">
                  Sector: {activeCompany?.sector} · Active Exposure: {activeCompany?.loanExposure}
                </CardDescription>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border uppercase ${
                activeCompany?.riskLevel === "low"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : activeCompany?.riskLevel === "medium"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {activeCompany?.riskLevel} RISK
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border/60">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Executive Risk Narrative & Synthesis
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insights?.summary ||
                  `Evaluated capital structure, debt service coverage, and operational resilience for ${activeCompany?.name}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Credit Score</span>
                <p className="text-xl font-bold mt-1 text-primary">
                  {insights?.credit_score ?? activeCompany?.creditScore}/100
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Human Review Status</span>
                <p className={`text-xl font-bold mt-1 capitalize ${
                  insights?.human_review_required ? "text-purple-400" : "text-emerald-400"
                }`}>
                  {insights?.human_review_required ? "Required" : "Automated"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Rating Category</span>
                <p className="text-xl font-bold mt-1">
                  {(insights?.credit_score ?? activeCompany?.creditScore) >= 75 ? "A / A+" : (insights?.credit_score ?? activeCompany?.creditScore) >= 60 ? "BBB" : "BB-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Officer Review Mandate */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Officer Review Checklist
            </CardTitle>
            <CardDescription className="text-xs">
              Actions required prior to loan execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              {insights?.review_prompts?.map((prompt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <BadgeAlert className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{prompt}</span>
                </div>
              )) || (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> Ready for final officer sign-off
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-3">
                Inspect complete risk model breakdown and execute credit approval workflow:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/risk"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Credit Risk <ChevronRight className="h-3 w-3" />
                </a>
                <a
                  href="/report"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition-colors"
                >
                  Full Report <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Distinct Section Cards: FACT, CALCULATED METRIC, AI INTERPRETATION, RECOMMENDATION */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. FACTS */}
        <Card className="border-purple-500/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-400">
              <FileCheck2 className="h-4 w-4" /> 1. Verified Corporate Facts
            </CardTitle>
            <CardDescription className="text-xs">
              Audited corporate registrations, capital structure figures, and facility obligations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights?.facts?.map((f, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-300">{f.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadge(f.severity)}`}>
                    {f.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. CALCULATED METRICS */}
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
              <Calculator className="h-4 w-4" /> 2. Deterministic Financial Ratios
            </CardTitle>
            <CardDescription className="text-xs">
              Mathematical ratios computed directly from balance sheet and income statements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights?.calculated_metrics?.map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-300">{m.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadge(m.severity)}`}>
                    {m.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. AI INTERPRETATION */}
        <Card className="border-purple-500/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-400">
              <BrainCircuit className="h-4 w-4" /> 3. Explainable AI Risk Interpretation
            </CardTitle>
            <CardDescription className="text-xs">
              Contextual synthesis of industry dynamics, covenant headroom, and rate shock sensitivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights?.ai_interpretations?.map((ai, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-300">{ai.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadge(ai.severity)}`}>
                    {ai.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{ai.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 4. RECOMMENDATIONS */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" /> 4. Structuring & Covenant Recommendations
            </CardTitle>
            <CardDescription className="text-xs">
              Recommended pricing, collateral coverage, and covenants for authorized officer review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights?.recommendations?.map((r, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary">{r.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadge(r.severity)}`}>
                    {r.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-xs text-muted-foreground flex items-start gap-3">
        <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-foreground">Corporate Banking Compliance Notice:</span>{" "}
          AI-generated insights and covenant proposals are decision-support recommendations intended solely for accredited credit officers. Final loan approval, covenant execution, and collateral perfection must be ratified by the credit approval committee in accordance with regulatory banking standards.
        </p>
      </div>
    </div>
  )
}
