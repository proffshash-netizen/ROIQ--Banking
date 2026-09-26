// Credit Risk – Executive Summary & Decision Matrix Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ExecutiveSummaryVM } from "../types";
import { RiskBadge, AIInsight, MetricRow } from "./shared";
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "../transformers";

interface Props {
  data: ExecutiveSummaryVM;
}

export const ExecutiveSummaryWidget: React.FC<Props> = ({ data }) => {
  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "Approved": return <CheckCircle2 className="h-5 w-5 text-[#16805B]" />;
      case "Rejected": return <XCircle className="h-5 w-5 text-[#C53D3D]" />;
      default: return <AlertCircle className="h-5 w-5 text-[#B7791F]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Credit Decision Header Banner */}
      <Card className="border border-[#E2E8F0] bg-white">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {getDecisionIcon(data.recommendedDecision)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#64748B]">Recommended decision</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#16805B]/10 text-[#16805B] font-semibold">{data.recommendedDecision}</span>
                </div>
                <p className="text-lg font-bold tracking-tight text-[#172033] mt-0.5">
                  Credit facility limit: <span className="text-[#16805B]">{formatCurrency(data.creditFacilityLimit)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#E2E8F0]">
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-semibold">Unified Risk Score</p>
                <p className="text-2xl font-bold tracking-tight text-[#172033]">{data.unifiedRiskScore}<span className="text-xs text-[#64748B] font-normal"> / 100</span></p>
              </div>
              <div className="h-8 w-px bg-[#E2E8F0]" />
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-semibold">Composite Rating</p>
                <div className="mt-0.5"><RiskBadge level={data.compositeRiskRating} /></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Score Drivers */}
        <Card className="border border-[#E2E8F0] bg-white">
          <CardHeader className="pb-2 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-semibold text-[#172033] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2457D6]" />
              Risk score drivers & components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-2">
            <MetricRow label="Market risk score component" value={`${data.marketRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Credit risk score component" value={`${data.creditRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Unified composite score" value={`${data.unifiedRiskScore.toFixed(0)} / 100`} />
            <MetricRow label="Risk classification" value={data.compositeRiskRating} badge={<RiskBadge level={data.compositeRiskRating} />} />
          </CardContent>
        </Card>

        {/* Warning Signals */}
        <Card className="border border-[#E2E8F0] bg-white">
          <CardHeader className="pb-2 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-semibold text-[#C53D3D] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#C53D3D]" />
              Key warning signals ({data.warningSignals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {data.warningSignals.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">No critical warning signals detected.</p>
            ) : (
              <div className="space-y-2">
                {data.warningSignals.map((signal, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded bg-[#C53D3D]/5 border border-[#C53D3D]/15">
                    <AlertTriangle className="h-3.5 w-3.5 text-[#C53D3D] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#172033] leading-snug">{signal}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Decision Rationale Box */}
      <Card className="border border-[#E2E8F0] bg-white">
        <CardContent className="pt-3 pb-3">
          <AIInsight title="Executive decision rationale & next steps" text={data.aiDecisionRationale} />
        </CardContent>
      </Card>
    </div>
  );
};

