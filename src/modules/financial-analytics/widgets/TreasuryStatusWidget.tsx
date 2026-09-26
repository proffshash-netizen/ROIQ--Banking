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
  <Card className="col-span-1 md:col-span-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Treasury Portfolio</CardTitle>
      <Landmark className="h-4 w-4 text-purple-400" />
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline gap-3 mb-1">
        <KPI label="Total Portfolio Value" value={formatCurrency(data.totalPortfolioValue)} />
        <StatusBadge label={data.riskRating} variant={getRiskVariant(data.riskRating)} />
      </div>
      <div className="grid grid-cols-2 gap-x-6 mt-4">
        <MetricRow label="Government Bonds" value={formatCurrency(data.governmentBonds)} />
        <MetricRow label="Corporate Bonds" value={formatCurrency(data.corporateBonds)} />
        <MetricRow label="Treasury Bills" value={formatCurrency(data.treasuryBills)} />
        <MetricRow label="Treasury Notes" value={formatCurrency(data.treasuryNotes)} />
        <MetricRow label="Treasury Bonds" value={formatCurrency(data.treasuryBonds)} />
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Portfolio Allocation</p>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
          <div className="bg-purple-600" style={{ width: `${data.allocation.governmentPct}%` }} title={`Gov ${data.allocation.governmentPct}%`} />
          <div className="bg-emerald-500" style={{ width: `${data.allocation.corporatePct}%` }} title={`Corp ${data.allocation.corporatePct}%`} />
          <div className="bg-purple-400" style={{ width: `${data.allocation.billsPct}%` }} title={`Bills ${data.allocation.billsPct}%`} />
          <div className="bg-purple-800" style={{ width: `${data.allocation.notesPct}%` }} title={`Notes ${data.allocation.notesPct}%`} />
          <div className="bg-red-500" style={{ width: `${data.allocation.bondsPct}%` }} title={`Bonds ${data.allocation.bondsPct}%`} />
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-600 inline-block" /> Gov {data.allocation.governmentPct}%</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Corp {data.allocation.corporatePct}%</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-400 inline-block" /> Bills {data.allocation.billsPct}%</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-800 inline-block" /> Notes {data.allocation.notesPct}%</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> Bonds {data.allocation.bondsPct}%</span>
        </div>
      </div>
      <AIInsight text={data.aiAssessment} />
      <WidgetTimestamp date={formatDate(data.lastUpdated)} />
    </CardContent>
  </Card>
);
