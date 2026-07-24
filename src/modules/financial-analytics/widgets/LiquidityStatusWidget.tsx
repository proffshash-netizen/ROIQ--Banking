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
  <Card className="col-span-1 md:col-span-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Liquidity Position</CardTitle>
      <Droplets className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
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
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Current Ratio</p>
          <p className="text-2xl font-bold text-emerald-400">{data.currentRatio.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Quick Ratio</p>
          <p className="text-2xl font-bold text-blue-400">{data.quickRatio.toFixed(2)}</p>
        </div>
      </div>
      <AIInsight text={data.aiAssessment} />
      <WidgetTimestamp date={formatDate(data.lastUpdated)} />
    </CardContent>
  </Card>
);
