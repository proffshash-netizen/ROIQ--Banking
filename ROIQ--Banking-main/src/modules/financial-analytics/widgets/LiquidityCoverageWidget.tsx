// Liquidity Coverage Ratio (LCR) — Banking-style widget with bar chart instead of broken gauge
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LCRVM } from "../types";
import { StatusBadge, MetricRow, AIInsight, getComplianceVariant } from "./shared";
import { ShieldCheck } from "lucide-react";

interface Props {
  data: LCRVM;
}

export const LiquidityCoverageWidget: React.FC<Props> = ({ data }) => {
  // Clamp ratio for display (max 200 for visual)
  const displayRatio = Math.min(data.ratio, 200);
  const requiredPct = (data.requiredThreshold / 200) * 100;
  const actualPct  = (displayRatio / 200) * 100;

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
      formatter: (params: Array<{ value: number; name: string }>) =>
        `LCR: <strong>${params[0]?.value ?? data.ratio}%</strong>`,
    },
    grid: { top: 8, right: 12, bottom: 24, left: 48, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: ["LCR"],
      axisLine: { lineStyle: { color: "#D9E1EA" } },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value" as const,
      min: 0,
      max: 200,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#EBF0F7", type: "dashed" as const } },
      axisLabel: { color: "#5F6F85", fontSize: 10, formatter: "{value}%" },
    },
    series: [
      {
        name: "Required",
        type: "bar",
        stack: "lcr",
        barWidth: 32,
        data: [data.requiredThreshold],
        itemStyle: { color: "#D9E1EA", borderRadius: [0, 0, 0, 0] },
        z: 1,
      },
      {
        name: "Buffer",
        type: "bar",
        stack: "lcr",
        barWidth: 32,
        data: [Math.max(0, displayRatio - data.requiredThreshold)],
        itemStyle: { color: "#238B5B", borderRadius: [3, 3, 0, 0] },
        z: 2,
      },
    ],
    animation: false,
  };

  const isCompliant = data.ratio >= data.requiredThreshold;
  const scoreColor = isCompliant ? "#238B5B" : "#C74646";

  return (
    <Card className="border border-[#D9E1EA] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D9E1EA]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Liquidity coverage (LCR)</CardTitle>
        <ShieldCheck className="h-4 w-4 text-[#238B5B]" />
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
            <span className="text-sm text-[#5F6F85] ml-1">LCR</span>
          </div>
          <StatusBadge label={data.complianceStatus} variant={getComplianceVariant(data.complianceStatus)} />
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="relative h-4 w-full rounded overflow-hidden bg-[#EBF0F7]">
            {/* Required threshold marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#C98A16] z-10"
              style={{ left: `${requiredPct}%` }}
              title={`Required: ${data.requiredThreshold}%`}
            />
            {/* Actual fill */}
            <div
              className="absolute top-0 left-0 bottom-0 transition-all rounded"
              style={{
                width: `${actualPct}%`,
                background: isCompliant ? "#238B5B" : "#C74646",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#5F6F85]">
            <span>0%</span>
            <span className="text-[#C98A16] font-semibold">Req: {data.requiredThreshold}%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Bar chart */}
        <ReactEChartsCore
          key={`lcr-${data.ratio}`}
          option={option}
          style={{ height: 110 }}
          notMerge
        />

        <div className="pt-1 border-t border-[#EBF0F7]">
          <MetricRow label="Regulatory Buffer" value={`+${data.buffer.toFixed(1)}%`} />
          <MetricRow label="Health Score" value={data.regulatoryHealth} />
        </div>
        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};
