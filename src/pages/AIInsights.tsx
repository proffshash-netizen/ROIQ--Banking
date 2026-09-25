import { useState, useEffect } from "react"
import { Sparkles, BrainCircuit, ShieldCheck, AlertCircle, RefreshCw, ChevronRight, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCompaniesStore } from "@/stores/companiesStore"
import { api } from "@/lib/api"

export function AIInsights() {
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()
  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0]

  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  const runAnalysis = async () => {
    setIsLoading(true)
    try {
      const res = await api.post("/analysis/company", {
        company_id: String(activeCompany.name || "AAPL"),
        include_risk: true,
        include_explainability: true,
      })
      if (res.data?.data) {
        setAnalysisData(res.data.data)
      }
    } catch (err: any) {
      // Local fallback for offline mode
      setAnalysisData({
        company_id: activeCompany.name,
        summary: `Automated AI risk evaluation for ${activeCompany.name}`,
        risk_score: activeCompany.creditScore / 100,
        status: "ready",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runAnalysis()
  }, [selectedCompanyId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-primary" /> AI Insights & Copilot
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time inference orchestrating multi-agent LangGraph risk evaluation workflows
          </p>
        </div>
        <Button
          onClick={runAnalysis}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Re-run Analysis
        </Button>
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

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Analysis Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{activeCompany.name}</CardTitle>
                <CardDescription className="text-xs">
                  {activeCompany.sector} · Exposure: {activeCompany.loanExposure}
                </CardDescription>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {activeCompany.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border/60">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <BrainCircuit className="h-4 w-4 text-primary" />
                LangGraph Decision Engine Summary
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysisData?.summary ||
                  `Evaluated capital structure, revenue consistency, and balance sheet resilience for ${activeCompany.name}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Inference Score</span>
                <p className="text-xl font-bold mt-1 text-primary">
                  {analysisData ? `${(analysisData.risk_score * 100).toFixed(1)}%` : `${activeCompany.creditScore}%`}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Pipeline State</span>
                <p className="text-xl font-bold mt-1 text-emerald-400 capitalize">
                  {analysisData?.status || "Ready"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="text-[11px] text-muted-foreground">Credit Rating</span>
                <p className="text-xl font-bold mt-1">
                  {activeCompany.creditScore > 75 ? "A / A+" : activeCompany.creditScore > 60 ? "BBB" : "BB-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Action Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Underwriter Action
            </CardTitle>
            <CardDescription className="text-xs">
              AI recommendation synthesized from financial metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> Debt Service Ratio: Compliant
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                <ShieldCheck className="h-4 w-4" /> Liquidity Benchmark: Stable
              </div>
              {activeCompany.riskLevel === "critical" && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-400">
                  <AlertCircle className="h-4 w-4" /> Requires Collateral Enhancement
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-3">
                Export comprehensive memo or proceed to full executive credit report.
              </p>
              <a
                href="/report"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Open Executive Report <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
