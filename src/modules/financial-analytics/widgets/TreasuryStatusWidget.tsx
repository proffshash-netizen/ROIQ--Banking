// Treasury Status Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { TreasuryVM } from "../types";
import { formatCurrency, formatDate } from "../transformers";
import { StatusBadge, KPI, MetricRow, AIInsight, WidgetTimestamp, getRiskVariant } from "./shared";
import { Landmark } from "lucide-react";

interface Props {
  data: TreasuryVM;
}

export const TreasuryStatusWidget: React.FC<Props> = ({ data }) => (
  <Card className="col-span-1 md:col-span-2 border border-[#E2E8F0] bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
      <CardTitle className="text-sm font-semibold text-[#172033]">Treasury portfolio</CardTitle>
      <Landmark className="h-4 w-4 text-[#2457D6]" />
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-baseline gap-3 mb-1">
        <KPI label="Total portfolio value" value={formatCurrency(data.totalPortfolioValue)} />
        <StatusBadge label={data.riskRating} variant={getRiskVariant(data.riskRating)} />
      </div>
      <div className="grid grid-cols-2 gap-x-6 mt-4">
        <MetricRow label="Government Bonds" value={formatCurrency(data.governmentBonds)} />
        <MetricRow label="Corporate Bonds" value={formatCurrency(data.corporateBonds)} />
        <MetricRow label="Treasury Bills" value={formatCurrency(data.treasuryBills)} />
        <MetricRow label="Treasury Notes" value={formatCurrency(data.treasuryNotes)} />
        <MetricRow label="Treasury Bonds" value={formatCurrency(data.treasuryBonds)} />
      </div>
      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">Portfolio allocation</p>
        <div className="flex gap-1 h-2 rounded overflow-hidden bg-slate-100">
          <div className="bg-[#2457D6]" style={{ width: `${data.allocation.governmentPct}%` }} title={`Gov ${data.allocation.governmentPct}%`} />
          <div className="bg-[#16805B]" style={{ width: `${data.allocation.corporatePct}%` }} title={`Corp ${data.allocation.corporatePct}%`} />
          <div className="bg-[#94A3B8]" style={{ width: `${data.allocation.billsPct}%` }} title={`Bills ${data.allocation.billsPct}%`} />
          <div className="bg-[#64748B]" style={{ width: `${data.allocation.notesPct}%` }} title={`Notes ${data.allocation.notesPct}%`} />
          <div className="bg-[#C53D3D]" style={{ width: `${data.allocation.bondsPct}%` }} title={`Bonds ${data.allocation.bondsPct}%`} />
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-[11px] text-[#64748B] flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2457D6] inline-block" /> Gov {data.allocation.governmentPct}%</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#16805B] inline-block" /> Corp {data.allocation.corporatePct}%</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#94A3B8] inline-block" /> Bills {data.allocation.billsPct}%</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#64748B] inline-block" /> Notes {data.allocation.notesPct}%</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#C53D3D] inline-block" /> Bonds {data.allocation.bondsPct}%</span>
        </div>
      </div>
      <AIInsight text={data.aiAssessment} />
      <WidgetTimestamp date={formatDate(data.lastUpdated)} />
    </CardContent>
  </Card>
);

