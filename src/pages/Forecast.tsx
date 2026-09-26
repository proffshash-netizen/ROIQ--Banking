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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Financial forecasting</span>
            <span>·</span>
            <span className="font-semibold text-[#172033]">{activeCompany.name}</span>
            <span>·</span>
            <span>{activeCompany.sector}</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033] leading-tight">Macroeconomic &amp; Financial Forecasting</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Predictive modeling combining balance sheet parameters with industry and global economic segments.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#172033] hover:bg-[#F8FAFC] transition shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#64748B]" />
          Refresh forecasts
        </button>
      </div>

      {/* Main Grid: Corporate & Macro Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {corporateVM && <CorporateFinancialWidget data={corporateVM} />}
        {macroVM && <MacroIndustryWidget data={macroVM} />}
      </div>

      {/* Forecast Radar & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t border-[#E2E8F0]">
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold tracking-tight text-[#172033] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#2457D6]" />
              Composite modeling outlook &amp; assumptions
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              The forecast model synthesizes historical balance sheet trends with forward-looking industry cash flow regressions. Actual historic figures (solid line) are calibrated against projected scenarios (dashed line) to test covenant stress thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-1">
              <span className="text-[11px] font-medium text-[#64748B] block">Model confidence</span>
              <span className="text-2xl font-bold font-mono text-[#172033]">{summaryVM.forecastConfidence}%</span>
              <p className="text-[11px] text-[#64748B]">Historical covariance &amp; reporting reliability index.</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-1">
              <span className="text-[11px] font-medium text-[#64748B] block">Projected growth (FY2026-27)</span>
              <span className="text-2xl font-bold font-mono text-[#16805B]">+14.8% YoY</span>
              <p className="text-[11px] text-[#64748B]">Top-line corporate revenue expansion trajectory.</p>
            </div>
          </div>

          {/* Model Assumptions Panel */}
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2 text-xs">
            <span className="font-semibold text-[#172033] text-xs block">Baseline model assumptions</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#64748B]">
              <div>GDP Growth: <strong className="text-[#172033]">6.8%</strong></div>
              <div>Inflation (CPI): <strong className="text-[#172033]">4.2%</strong></div>
              <div>Repo Rate: <strong className="text-[#172033]">6.50%</strong></div>
              <div>USD/INR Range: <strong className="text-[#172033]">83.2 - 84.5</strong></div>
            </div>
          </div>
        </div>
        {summaryVM && <ForecastSummaryWidget data={summaryVM} />}
      </div>
    </div>
  );
}

