// Liquidity Status Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import type { LiquidityVM } from "../types";
import { formatCurrency, formatDate } from "../transformers";
import { StatusBadge, KPI, MetricRow, AIInsight, WidgetTimestamp, getHealthVariant } from "./shared";
import { Droplets } from "lucide-react";

interface Props {
  data: LiquidityVM;
}

export const LiquidityStatusWidget: React.FC<Props> = ({ data }) => (
  <Card className="col-span-1 md:col-span-2 border border-[#E2E8F0] bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
      <CardTitle className="text-sm font-semibold text-[#172033]">Liquidity position</CardTitle>
      <Droplets className="h-4 w-4 text-[#2457D6]" />
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-baseline gap-3 mb-1">
        <KPI label="Cash Position" value={formatCurrency(data.totalCash)} />
        <StatusBadge label={data.liquidityHealth} variant={getHealthVariant(data.liquidityHealth)} />
      </div>
      <div className="grid grid-cols-2 gap-x-6 mt-4">
        <MetricRow label="Liquid Assets" value={formatCurrency(data.totalLiquidAssets)} />
        <MetricRow label="Total Funding" value={formatCurrency(data.totalFunding)} />
        <MetricRow label="Stable Funding" value={formatCurrency(data.stableFunding)} />
        <MetricRow label="Short-term Debt" value={formatCurrency(data.shortTermDebt)} />
        <MetricRow label="Long-term Debt" value={formatCurrency(data.longTermDebt)} />
        <MetricRow label="Total Debt" value={formatCurrency(data.totalDebt)} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E2E8F0]">
        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">Current Ratio</p>
          <p className="text-2xl font-bold font-mono text-[#16805B]">{data.currentRatio.toFixed(2)}x</p>
        </div>
        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">Quick Ratio</p>
          <p className="text-2xl font-bold font-mono text-[#2457D6]">{data.quickRatio.toFixed(2)}x</p>
        </div>
      </div>
      <AIInsight text={data.aiAssessment} />
      <WidgetTimestamp date={formatDate(data.lastUpdated)} />
    </CardContent>
  </Card>
);

