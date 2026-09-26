// src/modules/financial-analytics/pages/FinancialAnalyticsPage.tsx
import React, { useState } from "react";
import { useFinancialAnalytics } from "../hooks/useFinancialAnalytics";
import { ErrorState } from "../components/ErrorState";

import { TreasuryStatusWidget }      from "../widgets/TreasuryStatusWidget";
import { LiquidityStatusWidget }     from "../widgets/LiquidityStatusWidget";
import { InterestRateChartWidget }   from "../widgets/InterestRateChartWidget";
import { YieldCurveChartWidget }     from "../widgets/YieldCurveChartWidget";
import { DurationWidget }            from "../widgets/DurationWidget";
import { LiquidityCoverageWidget }   from "../widgets/LiquidityCoverageWidget";
import { NetStableFundingWidget }    from "../widgets/NetStableFundingWidget";
import { PortfolioSummaryWidget }    from "../widgets/PortfolioSummaryWidget";
import { AIInsightsPanel }           from "../widgets/AIInsightsPanel";
import { FinancialAnalyticsSkeleton } from "../widgets/LoadingSkeletons";

import {
  transformTreasury,
  transformLiquidity,
  transformInterestRate,
  transformYieldCurve,
  transformDuration,
  transformLCR,
  transformNSFR,
  transformPortfolio,
  transformAIStatus,
} from "../transformers";

import { ChevronDown, ChevronUp, RefreshCw, ChevronRight } from "lucide-react";

// Legacy diagnostic components (kept for audit purposes)
import { TreasurySummaryCard }          from "../components/TreasurySummaryCard";
import { LiquiditySummaryCard }         from "../components/LiquiditySummaryCard";
import { TreasuryStatusCard }           from "../components/TreasuryStatusCard";
import { LiquidityStatusCard }          from "../components/LiquidityStatusCard";
import { InterestRateSummaryCard }      from "../components/InterestRateSummaryCard";
import { YieldCurveSummaryCard }        from "../components/YieldCurveSummaryCard";
import { DurationSummaryCard }          from "../components/DurationSummaryCard";
import { LiquidityCoverageSummaryCard } from "../components/LiquidityCoverageSummaryCard";
import { NetStableFundingSummaryCard }  from "../components/NetStableFundingSummaryCard";
import { PortfolioSummaryCard }         from "../components/PortfolioSummaryCard";
import { OverallFinancialHealthIndicator } from "../components/OverallFinancialHealthIndicator";
import { AIProcessingStatusCard }       from "../components/AIProcessingStatusCard";

export const FinancialAnalyticsPage: React.FC = () => {
  const { treasury, liquidity, loading, error, retry } = useFinancialAnalytics();
  const [showRawData, setShowRawData] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <FinancialAnalyticsSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  // Pre-transform view models
  const treasuryVM     = treasury  ? transformTreasury(treasury)               : null;
  const liquidityVM    = liquidity ? transformLiquidity(liquidity)              : null;
  const interestRateVM = treasury  ? transformInterestRate(treasury)            : null;
  const yieldCurveVM   = treasury  ? transformYieldCurve(treasury)             : null;
  const durationVM     = treasury  ? transformDuration(treasury)               : null;
  const lcrVM          = liquidity ? transformLCR(liquidity)                   : null;
  const nsfrVM         = liquidity ? transformNSFR(liquidity)                  : null;
  const portfolioVM    = treasury && liquidity ? transformPortfolio(treasury, liquidity) : null;
  const aiStatusVM     = transformAIStatus();

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 text-[#172033]">

      {/* ── Breadcrumb ── */}
      <nav className="bank-breadcrumb">
        <span>Home</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span>Analytics</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span className="text-[#172033] font-medium">Financial Analytics</span>
      </nav>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="bank-h1">Financial &amp; Treasury Analytics</h1>
          <p className="bank-body mt-1">
            Balance sheet liquidity monitoring, duration analysis, yield curve regression, and regulatory ratios.
          </p>
        </div>
        <button onClick={retry} className="btn-secondary shrink-0">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh analytics
        </button>
      </div>

      {/* ── Row 1: Treasury + Liquidity (2 col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {treasuryVM  && <TreasuryStatusWidget  data={treasuryVM} />}
        {liquidityVM && <LiquidityStatusWidget data={liquidityVM} />}
      </div>

      {/* ── Row 2: Portfolio (2 col) + AI Status (1 col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {portfolioVM && <PortfolioSummaryWidget data={portfolioVM} />}
        <AIInsightsPanel data={aiStatusVM} />
      </div>

      {/* ── Row 3: Interest Rate Chart (full width) ── */}
      {interestRateVM && (
        <div className="grid grid-cols-1 gap-5">
          <InterestRateChartWidget data={interestRateVM} />
        </div>
      )}

      {/* ── Row 4: Yield Curve (1 col) + Duration (1 col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {yieldCurveVM && <YieldCurveChartWidget data={yieldCurveVM} />}
        {durationVM   && <DurationWidget        data={durationVM} />}
      </div>

      {/* ── Row 5: LCR + NSFR (2 col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lcrVM  && <LiquidityCoverageWidget data={lcrVM} />}
        {nsfrVM && <NetStableFundingWidget  data={nsfrVM} />}
      </div>

      {/* ── Diagnostic / Raw Data Section ── */}
      <div className="pt-3 border-t border-[#D9E1EA]">
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center justify-between w-full py-2.5 px-4 rounded border border-[#D9E1EA] bg-[#F8FAFC] hover:bg-[#EAF2FF] transition text-xs font-semibold text-[#5F6F85]"
        >
          <span>⚙️ Raw Technical Diagnostic Data &amp; System Inspection</span>
          {showRawData
            ? <ChevronUp   className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />
          }
        </button>

        {showRawData && (
          <div className="mt-4 p-4 rounded border border-[#D9E1EA] bg-white space-y-4">
            <p className="text-[11px] text-[#5F6F85]">
              Audit and compliance inspection panel — raw JSON nodes for diagnostics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <OverallFinancialHealthIndicator treasury={treasury || undefined} liquidity={liquidity || undefined} />
              {treasury  && <TreasurySummaryCard data={treasury} />}
              {liquidity && <LiquiditySummaryCard data={liquidity} />}
              {treasury  && <TreasuryStatusCard data={treasury} />}
              {liquidity && <LiquidityStatusCard data={liquidity} />}
              {treasury  && <InterestRateSummaryCard data={treasury} />}
              {treasury  && <YieldCurveSummaryCard data={treasury} />}
              {treasury  && <DurationSummaryCard data={treasury} />}
              {liquidity && <LiquidityCoverageSummaryCard data={liquidity} />}
              {liquidity && <NetStableFundingSummaryCard data={liquidity} />}
              {treasury && liquidity && <PortfolioSummaryCard treasury={treasury} liquidity={liquidity} />}
              <AIProcessingStatusCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
