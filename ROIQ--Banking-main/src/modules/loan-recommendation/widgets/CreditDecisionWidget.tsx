// Section 3: Credit Decision Engine Widget
// Generates recommendation, highlights single decision outcome, suggested rates, collateral, monitoring frequency, and triggered rule.

import React from "react";
import type { CreditDecisionVM } from "../types";
import { SectionHeader, DecisionBadge, AISummaryCard } from "./shared";
import { CheckCircle, AlertTriangle, HelpCircle, XCircle, Percent, ShieldCheck, Eye, Terminal } from "lucide-react";

interface CreditDecisionWidgetProps {
  data: CreditDecisionVM;
}

export const CreditDecisionWidget: React.FC<CreditDecisionWidgetProps> = ({ data }) => {
  const getDecisionIcon = () => {
    switch (data.decision) {
      case "APPROVE":
        return <CheckCircle className="h-9 w-9 text-emerald-400" />;
      case "APPROVE WITH CONDITIONS":
        return <AlertTriangle className="h-9 w-9 text-purple-400" />;
      case "FURTHER REVIEW":
        return <HelpCircle className="h-9 w-9 text-purple-300" />;
      case "REJECT":
        return <XCircle className="h-9 w-9 text-red-400" />;
    }
  };

  const getCardBannerStyle = () => {
    switch (data.decision) {
      case "APPROVE":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "APPROVE WITH CONDITIONS":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";
      case "FURTHER REVIEW":
        return "border-purple-500/30 bg-purple-500/10 text-purple-300";
      case "REJECT":
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
      <SectionHeader
        title="Credit Decision Engine"
        subtitle="AI-assisted credit decision synthesis and recommended terms"
        badgeText="Decision Output"
        icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
      />

      {/* Primary Highlighted Recommendation Outcome Card */}
      <div className={`rounded-xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${getCardBannerStyle()}`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-background/50 border border-current/20 shadow-inner">
            {getDecisionIcon()}
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider opacity-80">
              Recommended Credit Decision Outcome
            </span>
            <div className="mt-1">
              <DecisionBadge decision={data.decision} size="lg" />
            </div>
            <p className="text-xs text-foreground/80 mt-2 max-w-xl">
              Based on aggregated risk metrics, the system recommends <strong className="text-foreground">{data.decision}</strong> for this application.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-current/20 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
              Aggregated Score
            </span>
            <div className="text-2xl font-black text-foreground">{data.overallRiskScore}</div>
            <span className="text-[10px] opacity-75">{data.riskCategory} Risk</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
              Model Confidence
            </span>
            <div className="text-2xl font-black text-foreground">{data.confidenceScore}%</div>
            <span className="text-[10px] opacity-75">High Certainty</span>
          </div>
        </div>
      </div>

      {/* Suggested Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Suggested Interest Rate Band */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Suggested Interest Rate Band</span>
          </div>
          <div className="text-base font-bold text-foreground pt-1">{data.suggestedInterestRateBand}</div>
          <p className="text-[11px] text-muted-foreground">Risk-adjusted benchmark pricing structure</p>
        </div>

        {/* Suggested Collateral Requirement */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Collateral Requirement</span>
          </div>
          <div className="text-base font-bold text-foreground pt-1">{data.suggestedCollateralRequirement}</div>
          <p className="text-[11px] text-muted-foreground">Credit enhancement & security pledge terms</p>
        </div>

        {/* Suggested Monitoring Frequency */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Monitoring Frequency</span>
          </div>
          <div className="text-base font-bold text-foreground pt-1">{data.suggestedMonitoringFrequency}</div>
          <p className="text-[11px] text-muted-foreground">Post-approval audit & ratio review schedule</p>
        </div>
      </div>

      {/* Triggered Deterministic Business Rule Box */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 flex items-start gap-3">
        <Terminal className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Triggered Business Logic Rule</span>
          <p className="text-xs font-mono text-foreground">{data.triggeredRule}</p>
        </div>
      </div>

      <AISummaryCard text={data.aiSummary} title="AI Summary – Decision Synthesis" />
    </div>
  );
};
