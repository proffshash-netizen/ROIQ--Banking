// Credit Risk – Executive Summary & Decision Matrix Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ExecutiveSummaryVM } from "../types";
import { RiskBadge, AIInsight, SectionHeader, MetricRow } from "./shared";
import { Award, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "../transformers";

interface Props {
  data: ExecutiveSummaryVM;
}

export const ExecutiveSummaryWidget: React.FC<Props> = ({ data }) => {
  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "Approved": return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case "Rejected": return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <AlertCircle className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <>
      <SectionHeader
        title="Executive Credit Decision Support"
        subtitle="Unified Risk Score, Decision Matrix, and Key Warning Signals"
        icon={<Award className="h-5 w-5 text-emerald-400" />}
      />

      {/* Credit Decision Header Banner */}
      <Card className="mb-4 border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {getDecisionIcon(data.recommendedDecision)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended Credit Decision</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{data.recommendedDecision}</span>
                </div>
                <p className="text-lg font-bold tracking-tight mt-0.5">
                  Credit Facility Limit: <span className="text-emerald-400">{formatCurrency(data.creditFacilityLimit)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Unified Risk Score</p>
                <p className="text-2xl font-black tracking-tight text-purple-400">{data.unifiedRiskScore}<span className="text-xs text-muted-foreground font-normal">/100</span></p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Composite Risk Rating</p>
                <RiskBadge level={data.compositeRiskRating} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Score Drivers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              Risk Score Drivers & Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow label="Market Risk Score Component" value={`${data.marketRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Credit Risk Score Component" value={`${data.creditRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Unified Composite Score" value={`${data.unifiedRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Risk Classification" value={data.compositeRiskRating} badge={<RiskBadge level={data.compositeRiskRating} />} />
          </CardContent>
        </Card>

        {/* Warning Signals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Key Warning Signals ({data.warningSignals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.warningSignals.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No critical warning signals detected.</p>
            ) : (
              <div className="space-y-2">
                {data.warningSignals.map((signal, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-red-500/5 border border-red-500/15">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300 leading-snug">{signal}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Decision Rationale AI Box */}
      <Card className="mt-4">
        <CardContent className="pt-4">
          <AIInsight title="Executive Decision Rationale & Next Steps" text={data.aiDecisionRationale} />
        </CardContent>
      </Card>
    </>
  );
};
