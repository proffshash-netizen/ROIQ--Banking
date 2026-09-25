import { useState } from "react";
import {
  useCreditRisk,
  MarketRiskChartsWidget,
  CreditRiskChartsWidget,
  ExecutiveSummaryWidget,
  CreditRiskStatementsWidget,
  LoadingSkeleton,
} from "@/modules/credit-risk";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useCompaniesStore } from "@/stores/companiesStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Risk() {
  const {
    marketRisk,
    creditRisk,
    executiveSummary,
    loading,
    analyzing,
    error,
    analysisResult,
    analyzeRisk,
    submitReview,
    retry,
  } = useCreditRisk();

  const activeCompany = useCompaniesStore((state) =>
    state.companies.find((c) => c.id === state.selectedCompanyId) ?? state.companies[0]
  );

  const [officerNotes, setOfficerNotes] = useState(
    "Authorized by Corporate Credit Committee subject to senior lien covenants."
  );
  const [adjustedCat, setAdjustedCat] = useState<string>("Medium");

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Error Loading Credit Risk Data</h3>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs">{error}</span>
            <Button variant="outline" size="sm" onClick={retry} className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Active Entity & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entity</span>
          <span className="text-sm font-bold text-primary">{activeCompany.name}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{activeCompany.sector}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            Credit Score:{" "}
            <span
              className={`font-bold ${
                activeCompany.creditScore >= 75
                  ? "text-emerald-400"
                  : activeCompany.creditScore >= 55
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {activeCompany.creditScore}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            Exposure: <span className="font-bold text-foreground">{activeCompany.loanExposure}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => analyzeRisk()}
            disabled={analyzing}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {analyzing ? "Executing LangGraph..." : "Run LangGraph Risk Analysis"}
          </Button>
        </div>
      </div>

      {/* Human-in-the-Loop Approval Banner (if Paused or Triggered) */}
      {analysisResult && (
        <Card
          className={`border-2 transition-all ${
            analysisResult.workflow_status === "PAUSED_FOR_APPROVAL"
              ? "border-amber-500/50 bg-amber-500/5"
              : "border-emerald-500/40 bg-emerald-500/5"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle className="text-base font-bold">
                  LangGraph Workflow Status:{" "}
                  <span
                    className={
                      analysisResult.workflow_status === "PAUSED_FOR_APPROVAL"
                        ? "text-amber-400 font-extrabold"
                        : "text-emerald-400 font-extrabold"
                    }
                  >
                    {analysisResult.workflow_status}
                  </span>
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Thread: {analysisResult.thread_id}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    analysisResult.risk_category === "Low"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : analysisResult.risk_category === "Medium"
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-rose-400/10 text-rose-400"
                  }`}
                >
                  {analysisResult.risk_category.toUpperCase()} RISK
                </span>
              </div>
            </div>
            <CardDescription className="text-xs mt-1">
              Score: {analysisResult.credit_score}/100 · Rating: {analysisResult.credit_rating} · Default Probability:{" "}
              {(analysisResult.probability_of_default * 100).toFixed(2)}%
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Risk factors & Positive factors chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border/50 bg-background/50 space-y-1.5">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Positive Mitigating Factors:
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysisResult.positive_factors?.length ? (
                    analysisResult.positive_factors.map((f, i) => <li key={i}>{f}</li>)
                  ) : (
                    <li>Established franchise footprint with monitored credit lines.</li>
                  )}
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border/50 bg-background/50 space-y-1.5">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Key Risk Factors & Covenants:
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysisResult.risk_factors?.length ? (
                    analysisResult.risk_factors.map((f, i) => <li key={i}>{f}</li>)
                  ) : (
                    <li>Standard macro rate sensitivity and cyclical operational risks.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Human in the loop action controls */}
            {analysisResult.workflow_status === "PAUSED_FOR_APPROVAL" && (
              <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <UserCheck className="h-4 w-4" />
                  Mandatory Credit Committee Review (Human-in-the-Loop)
                </div>
                <p className="text-xs text-muted-foreground">
                  Institutional policy requires Senior Risk Officer review for {analysisResult.risk_category} risk profiles before facility authorization.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="text"
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter audit/approval justification notes..."
                    className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <select
                    value={adjustedCat}
                    onChange={(e) => setAdjustedCat(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Low">Low Risk Override</option>
                    <option value="Medium">Medium Risk Standing</option>
                    <option value="High">High Risk Standing</option>
                    <option value="Critical">Critical Risk Standing</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        submitReview({
                          approved: true,
                          notes: officerNotes,
                          adjusted_category: adjustedCat,
                          officer: "Senior Risk Officer",
                        })
                      }
                      disabled={analyzing}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve Facility
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        submitReview({
                          approved: false,
                          notes: officerNotes,
                          officer: "Senior Risk Officer",
                        })
                      }
                      disabled={analyzing}
                      className="gap-1.5 text-xs"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Decline Facility
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Approved Summary Badge */}
            {analysisResult.workflow_status === "COMPLETED" && analysisResult.recommendation && (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">
                    Decision Finalized: {analysisResult.recommendation.decision}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span>Approved Amount: ${(analysisResult.recommendation.approved_amount / 1_000_000).toFixed(1)}M</span>
                  <span className="text-muted-foreground">·</span>
                  <span>Spread: {analysisResult.recommendation.pricing_spread}</span>
                </div>
                {analysisResult.human_approval && (
                  <span className="text-muted-foreground italic">
                    Signed by {analysisResult.human_approval.officer || "Officer"}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Executive Decision Support Banner */}
      {executiveSummary && <ExecutiveSummaryWidget data={executiveSummary} />}

      {/* Exposure Distribution & Debt Ratios Charts – Side by Side */}
      {marketRisk && creditRisk && (
        <section className="pt-4 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MarketRiskChartsWidget data={marketRisk} />
            <CreditRiskChartsWidget data={creditRisk} />
          </div>
        </section>
      )}

      {/* Loan & Credit Risk Analysis Statement */}
      {marketRisk && creditRisk && executiveSummary && (
        <section className="pt-4 border-t border-border/40">
          <CreditRiskStatementsWidget
            marketRisk={marketRisk}
            creditRisk={creditRisk}
            executiveSummary={executiveSummary}
          />
        </section>
      )}
    </div>
  );
}

export default Risk;
