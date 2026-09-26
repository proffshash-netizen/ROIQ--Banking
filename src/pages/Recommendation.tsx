import {
  useLoanRecommendation,
  CreditDecisionWidget,
  ExplainabilityPanelWidget,
  LoadingSkeleton,
} from "@/modules/loan-recommendation";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
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

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Active Entity Banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Evaluating Loan</span>
        <span className="text-sm font-bold text-primary">{activeCompany.name}</span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">{activeCompany.sector}</span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">Exposure: <span className="font-bold text-foreground">{activeCompany.loanExposure}</span></span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
          activeCompany.riskLevel === "low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          activeCompany.riskLevel === "medium" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
          "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>{activeCompany.riskLevel.toUpperCase()} RISK</span>
      </div>

      {/* CREDIT DECISION ENGINE */}
      <CreditDecisionWidget data={data.creditDecision} />

      {/* EXPLAINABILITY & DECISION SUPPORT */}
      <ExplainabilityPanelWidget data={data.explainability} />
    </div>
  );
}

export default Recommendation;
