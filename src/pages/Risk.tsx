import {
  useCreditRisk,
  MarketRiskChartsWidget,
  CreditRiskChartsWidget,
  ExecutiveSummaryWidget,
  CreditRiskStatementsWidget,
  LoadingSkeleton,
} from "@/modules/credit-risk";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCompaniesStore } from "@/stores/companiesStore";

export function Risk() {
  const { marketRisk, creditRisk, executiveSummary, loading, error, retry } = useCreditRisk();
  const activeCompany = useCompaniesStore((state) =>
    state.companies.find((c) => c.id === state.selectedCompanyId) ?? state.companies[0]
  );

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
      {/* Active Entity Banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Analyzing Entity</span>
        <span className="text-sm font-bold text-primary">{activeCompany.name}</span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">{activeCompany.sector}</span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">Credit Score: <span className={`font-bold ${activeCompany.creditScore >= 75 ? "text-emerald-400" : activeCompany.creditScore >= 55 ? "text-amber-400" : "text-rose-400"}`}>{activeCompany.creditScore}</span></span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">Exposure: <span className="font-bold text-foreground">{activeCompany.loanExposure}</span></span>
      </div>

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

