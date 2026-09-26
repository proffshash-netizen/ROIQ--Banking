// Corporate Financial Analysis Widget – ECharts Line & Bar
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CorporateFinancialVM } from "../types";
import { formatCurrency, formatPct } from "../transformers";
import { MetricRow, AIInsight } from "./shared";
import { TrendingUp } from "lucide-react";

interface Props {
  data: CorporateFinancialVM;
}

export const CorporateFinancialWidget: React.FC<Props> = ({ data }) => {
  // 1. Revenue Trends & Profitability Line Chart Option
  const lineOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(272 38% 8%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(272 20% 92%)", fontSize: 11 },
    },
    legend: {
      data: ["Revenue", "Net Income", "Operating Income"],
      bottom: 0,
      textStyle: { color: "hsl(272 20% 70%)", fontSize: 10 },
    },
    grid: { top: 20, right: 16, bottom: 40, left: 50 },
    xAxis: {
      type: "category" as const,
      data: data.trends.map((t) => t.period),
      axisLine: { lineStyle: { color: "hsl(272 30% 20%)" } },
      axisLabel: { color: "hsl(272 20% 70%)", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(272 30% 16%)", type: "dashed" as const } },
      axisLabel: {
        color: "hsl(272 20% 70%)",
        fontSize: 10,
        formatter: (v: number) => `$${(v / 1_000_000_000).toFixed(1)}B`,
      },
    },
    series: [
      {
        name: "Revenue",
        type: "line",
        data: data.trends.map((t) => t.revenue),
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: "hsl(272 85% 65%)" },
      },
      {
        name: "Operating Income",
        type: "line",
        data: data.trends.map((t) => t.operatingIncome),
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "hsl(285 85% 72%)" },
      },
      {
        name: "Net Income",
        type: "line",
        data: data.trends.map((t) => t.netIncome),
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "hsl(142 76% 45%)" },
        areaStyle: { color: "hsla(142 76% 45% / 0.1)" },
      },
    ],
  };

  // 2. Financial Ratios Bar Chart Option
  const barOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(272 38% 8%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(272 20% 92%)", fontSize: 11 },
    },
    grid: { top: 20, right: 16, bottom: 20, left: 40 },
    xAxis: {
      type: "category" as const,
      data: ["ROE", "ROA", "Current Ratio", "Quick Ratio", "Debt to Equity"],
      axisLine: { lineStyle: { color: "hsl(272 30% 20%)" } },
      axisLabel: { color: "hsl(272 20% 70%)", fontSize: 9 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(272 30% 16%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(272 20% 70%)", fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: [
          { value: data.roe, itemStyle: { color: "hsl(272 85% 65%)" } },
          { value: data.roa, itemStyle: { color: "hsl(285 85% 72%)" } },
          { value: data.currentRatio * 10, itemStyle: { color: "hsl(142 76% 45%)" } },
          { value: data.quickRatio * 10, itemStyle: { color: "hsl(158 80% 36%)" } },
          { value: data.debtToEquity * 10, itemStyle: { color: "hsl(352 82% 54%)" } },
        ],
        barWidth: "40%",
        label: {
          show: true,
          position: "top",
          color: "hsl(272 20% 70%)",
          fontSize: 9,
          formatter: (p: { name: string; value: number }) => {
            if (["ROE", "ROA"].includes(p.name)) return `${p.value.toFixed(1)}%`;
            return (p.value / 10).toFixed(2);
          },
        },
      },
    ],
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Corporate Financial Analysis</CardTitle>
        <TrendingUp className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Revenue</span>
            <span className="text-lg font-bold text-purple-400">{formatCurrency(data.currentRevenue)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Net Profit</span>
            <span className="text-lg font-bold text-emerald-400">{formatCurrency(data.currentNetIncome)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Gross Margin</span>
            <span className="text-lg font-bold">{formatPct(data.grossMargin)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Free Cash Flow</span>
            <span className="text-lg font-bold text-purple-300">{formatCurrency(data.freeCashFlow)}</span>
          </div>
        </div>

        {/* Charts: Revenue Line + Ratios Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Revenue & Profitability Growth Trend
            </span>
            <ReactEChartsCore key={`corp-line-${data.currentRevenue}`} option={lineOption} style={{ height: 200 }} notMerge />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Core Ratios & Leverage Assessment
            </span>
            <ReactEChartsCore key={`corp-bar-${data.roe}-${data.roa}`} option={barOption} style={{ height: 200 }} notMerge />
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="grid grid-cols-2 gap-x-6">
          <MetricRow label="Return on Equity (ROE)" value={formatPct(data.roe)} />
          <MetricRow label="Return on Assets (ROA)" value={formatPct(data.roa)} />
          <MetricRow label="Current Ratio" value={data.currentRatio.toFixed(2)} />
          <MetricRow label="Quick Ratio" value={data.quickRatio.toFixed(2)} />
          <MetricRow label="Debt to Equity" value={data.debtToEquity.toFixed(2)} />
          <MetricRow label="Interest Coverage" value={data.interestCoverage.toFixed(2)} />
        </div>

        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};
