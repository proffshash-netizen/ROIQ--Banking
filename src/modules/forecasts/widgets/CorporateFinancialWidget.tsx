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
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    legend: {
      data: ["Revenue", "Net Income", "Operating Income"],
      bottom: 0,
      textStyle: { color: "#64748B", fontSize: 11 },
    },
    grid: { top: 20, right: 16, bottom: 40, left: 45, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: data.trends.map((t) => t.period),
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#64748B", fontSize: 11 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" as const } },
      axisLabel: {
        color: "#64748B",
        fontSize: 11,
        formatter: (v: number) => `$${(v / 1_000_000_000).toFixed(1)}B`,
      },
    },
    series: [
      {
        name: "Revenue",
        type: "line",
        data: data.trends.map((t) => t.revenue),
        smooth: true,
        lineStyle: { width: 2.5, color: "#2457D6" },
        itemStyle: { color: "#2457D6" },
      },
      {
        name: "Operating Income",
        type: "line",
        data: data.trends.map((t) => t.operatingIncome),
        smooth: true,
        lineStyle: { width: 2, color: "#64748B" },
        itemStyle: { color: "#64748B" },
      },
      {
        name: "Net Income",
        type: "line",
        data: data.trends.map((t) => t.netIncome),
        smooth: true,
        lineStyle: { width: 2, color: "#16805B" },
        itemStyle: { color: "#16805B" },
        areaStyle: { color: "rgba(22, 128, 91, 0.08)" },
      },
    ],
    animation: false,
  };

  // 2. Financial Ratios Bar Chart Option
  const barOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    grid: { top: 20, right: 16, bottom: 20, left: 35, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: ["ROE", "ROA", "Current Ratio", "Quick Ratio", "Debt to Equity"],
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#64748B", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" as const } },
      axisLabel: { color: "#64748B", fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: [
          { value: data.roe, itemStyle: { color: "#2457D6", borderRadius: [4, 4, 0, 0] } },
          { value: data.roa, itemStyle: { color: "#2457D6", borderRadius: [4, 4, 0, 0] } },
          { value: data.currentRatio * 10, itemStyle: { color: "#16805B", borderRadius: [4, 4, 0, 0] } },
          { value: data.quickRatio * 10, itemStyle: { color: "#16805B", borderRadius: [4, 4, 0, 0] } },
          { value: data.debtToEquity * 10, itemStyle: { color: "#B7791F", borderRadius: [4, 4, 0, 0] } },
        ],
        barWidth: "36%",
        label: {
          show: true,
          position: "top",
          color: "#64748B",
          fontSize: 10,
          formatter: (p: { name: string; value: number }) => {
            if (["ROE", "ROA"].includes(p.name)) return `${p.value.toFixed(1)}%`;
            return (p.value / 10).toFixed(2);
          },
        },
      },
    ],
    animation: false,
  };

  return (
    <Card className="col-span-1 lg:col-span-2 border border-[#E2E8F0] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Corporate financial analysis</CardTitle>
        <TrendingUp className="h-4 w-4 text-[#2457D6]" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Core KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Revenue</span>
            <span className="text-lg font-bold text-[#172033] mt-0.5 block">{formatCurrency(data.currentRevenue)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Net Profit</span>
            <span className="text-lg font-bold text-[#16805B] mt-0.5 block">{formatCurrency(data.currentNetIncome)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Gross Margin</span>
            <span className="text-lg font-bold text-[#172033] mt-0.5 block">{formatPct(data.grossMargin)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Free Cash Flow</span>
            <span className="text-lg font-bold text-[#172033] mt-0.5 block">{formatCurrency(data.freeCashFlow)}</span>
          </div>
        </div>

        {/* Charts: Revenue Line + Ratios Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#172033] block">
              Revenue & profitability trend
            </span>
            <ReactEChartsCore key={`corp-line-${data.currentRevenue}`} option={lineOption} style={{ height: 200 }} notMerge />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#172033] block">
              Core ratios & leverage assessment
            </span>
            <ReactEChartsCore key={`corp-bar-${data.roe}-${data.roa}`} option={barOption} style={{ height: 200 }} notMerge />
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="grid grid-cols-2 gap-x-6 pt-3 border-t border-[#E2E8F0]">
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

