// Net Stable Funding Ratio (NSFR) — Banking-style widget with bar chart instead of broken gauge
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { NSFRVM } from "../types";
import { formatCurrency } from "../transformers";
import { StatusBadge, MetricRow, AIInsight, getComplianceVariant } from "./shared";
import { ShieldCheck } from "lucide-react";

interface Props {
  data: NSFRVM;
}

export const NetStableFundingWidget: React.FC<Props> = ({ data }) => {
  const displayRatio = Math.min(data.ratio, 200);
  const requiredPct  = (100 / 200) * 100; // NSFR required = 100%
  const actualPct    = (displayRatio / 200) * 100;
  const isCompliant  = data.ratio >= 100;

  // Grouped bar: Available vs Required stable funding
  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    legend: {
      data: ["Available", "Required"],
      bottom: 0,
      textStyle: { color: "#5F6F85", fontSize: 10 },
    },
    grid: { top: 8, right: 12, bottom: 28, left: 12, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: ["Stable Funding"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#EBF0F7", type: "dashed" as const } },
      axisLabel: {
        color: "#5F6F85",
        fontSize: 10,
        formatter: (v: number) =>
          v >= 1_000_000_000
            ? `$${(v / 1_000_000_000).toFixed(1)}B`
            : v >= 1_000_000
            ? `$${(v / 1_000_000).toFixed(0)}M`
            : String(v),
      },
    },
    series: [
      {
        name: "Available",
        type: "bar",
        barWidth: 28,
        data: [data.availableStableFunding],
        itemStyle: { color: "#1E4FA3", borderRadius: [3, 3, 0, 0] },
      },
      {
        name: "Required",
        type: "bar",
        barWidth: 28,
        data: [data.requiredStableFunding],
        itemStyle: { color: "#D9E1EA", borderRadius: [3, 3, 0, 0] },
      },
    ],
    animation: false,
  };

  const scoreColor = isCompliant ? "#238B5B" : "#C74646";

  return (
    <Card className="border border-[#D9E1EA] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D9E1EA]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Net stable funding (NSFR)</CardTitle>
        <ShieldCheck className="h-4 w-4 text-[#1E4FA3]" />
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        {/* Score display */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-3xl font-bold"
              style={{ color: scoreColor, fontVariantNumeric: "tabular-nums" }}
            >
              {data.ratio.toFixed(1)}%
            </span>
            <span className="text-sm text-[#5F6F85] ml-1">NSFR</span>
          </div>
          <StatusBadge label={data.complianceStatus} variant={getComplianceVariant(data.complianceStatus)} />
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="relative h-4 w-full rounded overflow-hidden bg-[#EBF0F7]">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#C98A16] z-10"
              style={{ left: `${requiredPct}%` }}
              title="Required: 100%"
            />
            <div
              className="absolute top-0 left-0 bottom-0 transition-all rounded"
              style={{
                width: `${actualPct}%`,
                background: isCompliant ? "#1E4FA3" : "#C74646",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#5F6F85]">
            <span>0%</span>
            <span className="text-[#C98A16] font-semibold">Req: 100%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Bar chart */}
        <ReactEChartsCore
          key={`nsfr-${data.ratio}`}
          option={option}
          style={{ height: 120 }}
          notMerge
        />

        <div className="pt-1 border-t border-[#EBF0F7]">
          <MetricRow label="Available Stable Funding" value={formatCurrency(data.availableStableFunding)} />
          <MetricRow label="Required Stable Funding"  value={formatCurrency(data.requiredStableFunding)} />
          <MetricRow label="Funding Stability"        value={data.fundingStabilityScore} />
        </div>
        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};
