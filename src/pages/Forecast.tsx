// src/pages/Forecast.tsx
import { useState, useEffect } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

// Import components and mock services from forecasts module
import { fetchForecastData } from "../modules/forecasts/services/ForecastMockService";
import { ForecastPageSkeleton } from "../modules/forecasts/widgets/LoadingSkeletons";
import { CorporateFinancialWidget } from "../modules/forecasts/widgets/CorporateFinancialWidget";
import { MacroIndustryWidget } from "../modules/forecasts/widgets/MacroIndustryWidget";
import { ForecastSummaryWidget } from "../modules/forecasts/widgets/ForecastSummaryWidget";
import { ErrorState } from "../modules/financial-analytics/components/ErrorState";

// Import view model transformers
import {
  transformCorporate,
  transformMacro,
  transformForecastSummary,
} from "../modules/forecasts/transformers";
import type { ForecastResponse } from "../modules/forecasts/types";
import { useCompaniesStore } from "@/stores/companiesStore";

export function Forecast() {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);
  const activeCompany = useCompaniesStore((state) =>
    state.companies.find((c) => c.id === state.selectedCompanyId) ?? state.companies[0]
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchForecastData(selectedCompanyId);
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  if (loading) {
    return (
      <div className="p-6">
        <ForecastPageSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={error || "Failed to load forecast data"} onRetry={loadData} />;
  }

  // Transform raw data to clean view models
  const corporateVM = transformCorporate(data.corporate);
  const macroVM = transformMacro(data.macro);
  const summaryVM = transformForecastSummary(corporateVM, macroVM);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Active Entity</span>
            <span className="text-xs font-bold text-primary border border-primary/30 bg-primary/10 rounded px-2 py-0.5">
              {activeCompany.name} · {activeCompany.sector}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Macroeconomic &amp; Financial Forecasting</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Predictive modeling combining balance sheet parameters with industry and global economic segments.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm hover:bg-accent transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Forecasts
        </button>
      </div>

      {/* Main Grid: Corporate & Macro Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {corporateVM && <CorporateFinancialWidget data={corporateVM} />}
        {macroVM && <MacroIndustryWidget data={macroVM} />}
      </div>

      {/* Forecast Radar & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-border/20">
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Composite Modeling Outlook
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The forecast uses an ensemble regression algorithm running across active cash flows, revenue margins,
              macro interest rate trends, and country-level volatility metrics. Calculations update dynamically to maintain stable covenant tracking.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Model Confidence
              </span>
              <span className="text-2xl font-bold text-indigo-400">{summaryVM.forecastConfidence}%</span>
              <p className="text-[10px] text-muted-foreground mt-1">Based on historical parameter covariance.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Projected Growth (2026)
              </span>
              <span className="text-2xl font-bold text-emerald-400">+14.8% YoY</span>
              <p className="text-[10px] text-muted-foreground mt-1">Expected corporate top-line revenue expansion.</p>
            </div>
          </div>
        </div>
        {summaryVM && <ForecastSummaryWidget data={summaryVM} />}
      </div>
    </div>
  );
}
