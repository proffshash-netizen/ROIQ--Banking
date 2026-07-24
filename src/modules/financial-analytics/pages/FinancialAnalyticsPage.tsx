// src/modules/financial-analytics/pages/FinancialAnalyticsPage.tsx
import React, { useState } from "react";
import { useFinancialAnalytics } from "../hooks/useFinancialAnalytics";
import { ErrorState } from "../components/ErrorState";
// Import new enterprise widgets
import { TreasuryStatusWidget } from "../widgets/TreasuryStatusWidget";
import { LiquidityStatusWidget } from "../widgets/LiquidityStatusWidget";
import { InterestRateChartWidget } from "../widgets/InterestRateChartWidget";
import { YieldCurveChartWidget } from "../widgets/YieldCurveChartWidget";
import { DurationWidget } from "../widgets/DurationWidget";
import { LiquidityCoverageWidget } from "../widgets/LiquidityCoverageWidget";
import { NetStableFundingWidget } from "../widgets/NetStableFundingWidget";
import { PortfolioSummaryWidget } from "../widgets/PortfolioSummaryWidget";
import { AIInsightsPanel } from "../widgets/AIInsightsPanel";
import { FinancialAnalyticsSkeleton } from "../widgets/LoadingSkeletons";

// Import view model transformers
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

// Import original components (for preserving existing functionality)
import { TreasurySummaryCard } from "../components/TreasurySummaryCard";
import { LiquiditySummaryCard } from "../components/LiquiditySummaryCard";
import { TreasuryStatusCard } from "../components/TreasuryStatusCard";
import { LiquidityStatusCard } from "../components/LiquidityStatusCard";
import { InterestRateSummaryCard } from "../components/InterestRateSummaryCard";
import { YieldCurveSummaryCard } from "../components/YieldCurveSummaryCard";
import { DurationSummaryCard } from "../components/DurationSummaryCard";
import { LiquidityCoverageSummaryCard } from "../components/LiquidityCoverageSummaryCard";
import { NetStableFundingSummaryCard } from "../components/NetStableFundingSummaryCard";
import { PortfolioSummaryCard } from "../components/PortfolioSummaryCard";
import { OverallFinancialHealthIndicator } from "../components/OverallFinancialHealthIndicator";
import { AIProcessingStatusCard } from "../components/AIProcessingStatusCard";

import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

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

  // Pre-transform data for widgets safely
  const treasuryVM = treasury ? transformTreasury(treasury) : null;
  const liquidityVM = liquidity ? transformLiquidity(liquidity) : null;
  const interestRateVM = treasury ? transformInterestRate(treasury) : null;
  const yieldCurveVM = treasury ? transformYieldCurve(treasury) : null;
  const durationVM = treasury ? transformDuration(treasury) : null;
  const lcrVM = liquidity ? transformLCR(liquidity) : null;
  const nsfrVM = liquidity ? transformNSFR(liquidity) : null;
  const portfolioVM = treasury && liquidity ? transformPortfolio(treasury, liquidity) : null;
  const aiStatusVM = transformAIStatus();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial & Treasury Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise-grade liquidity monitoring, yield curves, and AI treasury assessments.
          </p>
        </div>
        <button
          onClick={retry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm hover:bg-accent transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Dashboard
        </button>
      </div>

      {/* Main Grid: Enterprise Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Treasury Status & Liquidity Position */}
        {treasuryVM && <TreasuryStatusWidget data={treasuryVM} />}
        {liquidityVM && <LiquidityStatusWidget data={liquidityVM} />}

        {/* Portfolio Allocation & AI Orchestration */}
        {portfolioVM && <PortfolioSummaryWidget data={portfolioVM} />}
        <AIInsightsPanel data={aiStatusVM} />

        {/* Market Analysis & Yield Curves */}
        {interestRateVM && <InterestRateChartWidget data={interestRateVM} />}
        {yieldCurveVM && <YieldCurveChartWidget data={yieldCurveVM} />}

        {/* Key Ratios & Duration Analysis */}
        {lcrVM && <LiquidityCoverageWidget data={lcrVM} />}
        {nsfrVM && <NetStableFundingWidget data={nsfrVM} />}
        {durationVM && <DurationWidget data={durationVM} />}
      </div>

      {/* Collapsible Section for Original Components (Preserving all functionality as required) */}
      <div className="pt-4 border-t border-border/30">
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition text-xs font-semibold text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            ⚙️ Raw Technical Diagnostic Data & System Inspection
          </span>
          {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showRawData && (
          <div className="mt-4 p-4 rounded-lg border border-border bg-card/50 space-y-4">
            <p className="text-[11px] text-muted-foreground">
              Note: This panel renders the original raw JSON nodes for audit, diagnostics, and compliance requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <OverallFinancialHealthIndicator treasury={treasury || undefined} liquidity={liquidity || undefined} />
              {treasury && <TreasurySummaryCard data={treasury} />}
              {liquidity && <LiquiditySummaryCard data={liquidity} />}
              {treasury && <TreasuryStatusCard data={treasury} />}
              {liquidity && <LiquidityStatusCard data={liquidity} />}
              {treasury && <InterestRateSummaryCard data={treasury} />}
              {treasury && <YieldCurveSummaryCard data={treasury} />}
              {treasury && <DurationSummaryCard data={treasury} />}
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
