// Section 4: Explainability & Decision Support Widget
// Displays positive/negative factors, risk drivers, mitigation strategies, loan conditions, docs, monitoring, and business justification.

import React from "react";
import type { ExplainabilityVM } from "../types";
import { SectionHeader, AISummaryCard } from "./shared";
import {
  Brain,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  ShieldCheck,
  FileCheck,
  ClipboardList,
  Activity,
  Quote,
} from "lucide-react";

interface ExplainabilityPanelWidgetProps {
  data: ExplainabilityVM;
}

export const ExplainabilityPanelWidget: React.FC<ExplainabilityPanelWidgetProps> = ({ data }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-6">
      <SectionHeader
        title="Explainability & Decision Support"
        subtitle="Transparent AI reasoning, risk factor breakdown, and credit committee rationale"
        badgeText="Explainable AI"
        icon={<Brain className="h-5 w-5 text-purple-400" />}
      />

      {/* Grid: Top Positive Factors & Top Negative Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Positive Factors */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ThumbsUp className="h-4 w-4" />
            <span>Top Positive Factors</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {data.topPositiveFactors.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Negative Factors */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wider">
            <ThumbsDown className="h-4 w-4" />
            <span>Top Negative Factors</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {data.topNegativeFactors.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid: Primary Risk Drivers & Mitigation Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Primary Risk Drivers */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wider">
            <AlertOctagon className="h-4 w-4" />
            <span>Primary Risk Drivers</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {data.primaryRiskDrivers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="text-foreground/90 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mitigation Strategies */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Mitigation Strategies</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {data.mitigationStrategies.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid 3 Columns: Recommended Conditions, Docs, Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recommended Loan Conditions */}
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <FileCheck className="h-4 w-4" />
            <span>Loan Covenants & Conditions</span>
          </div>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            {data.recommendedLoanConditions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documentation */}
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
            <ClipboardList className="h-4 w-4" />
            <span>Required Documentation</span>
          </div>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            {data.requiredDocumentation.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Post-Approval Monitoring */}
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Activity className="h-4 w-4" />
            <span>Post-Approval Monitoring</span>
          </div>
          <ul className="space-y-2 text-[11px] text-muted-foreground">
            {data.postApprovalMonitoring.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Business Justification Callout Box */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
          <Quote className="h-4 w-4" />
          <span>Executive Business Justification</span>
        </div>
        <blockquote className="text-sm font-medium text-foreground italic leading-relaxed pl-2 border-l-2 border-purple-400">
          "{data.businessJustification}"
        </blockquote>
      </div>

      <AISummaryCard text={data.aiSummary} title="AI Summary – Explainability & Transparency" />
    </div>
  );
};
