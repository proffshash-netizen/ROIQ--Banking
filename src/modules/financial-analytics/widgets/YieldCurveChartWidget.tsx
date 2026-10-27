// Yield Curve Chart Widget – ECharts Smooth Line
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { YieldCurveVM } from "../types";
import { StatusBadge, AIInsight } from "./shared";
import { GitBranch } from "lucide-react";

interface Props {
  data: YieldCurveVM;
}

export const YieldCurveChartWidget: React.FC<Props> = ({ data }) => {
  // Guard: fallback if tenors is empty
  const tenors = data.tenors.length > 0
    ? data.tenors
    : [
        { label: "3M", years: 0.25, yield: 5.85 },
        { label: "6M", years: 0.5,  yield: 6.02 },
        { label: "1Y", years: 1,    yield: 6.25 },
        { label: "2Y", years: 2,    yield: 6.48 },
        { label: "5Y", years: 5,    yield: 6.82 },
        { label: "10Y", years: 10,  yield: 7.05 },
        { label: "30Y", years: 30,  yield: 7.35 },
      ];

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0];
        return `<strong>${p.name}</strong><br/>Yield: ${Number(p.value).toFixed(2)}%`;
      },
    },
    grid: { top: 16, right: 16, bottom: 30, left: 10, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: tenors.map((t) => t.label),
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#D9E1EA" } },
      axisTick: { show: false },
      axisLabel: { color: "#5F6F85", fontSize: 11 },
    },
    yAxis: {
      type: "value" as const,
      min: (v: { min: number }) => Math.max(0, Math.floor((v.min - 0.5) * 10) / 10),
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#EBF0F7", type: "dashed" as const } },
      axisLabel: { color: "#5F6F85", fontSize: 11, formatter: "{value}%" },
    },
    series: [
      {
        type: "line",
        data: tenors.map((t) => t.yield),
        smooth: 0.4,
        lineStyle: { width: 2.5, color: "#1E4FA3" },
        itemStyle: { color: "#1E4FA3" },
        areaStyle: { color: "rgba(30, 79, 163, 0.08)" },
        symbolSize: 5,
        symbol: "circle",
      },
    ],
    animation: false,
  };

  const shapeVariant =
    data.shape.toLowerCase().includes("inverted") ? "danger"
    : data.shape.toLowerCase().includes("flat")     ? "warning"
    : "success";

  return (
    <Card className="col-span-1 md:col-span-1 border border-[#D9E1EA] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D9E1EA]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Treasury yield curve structure</CardTitle>
        <GitBranch className="h-4 w-4 text-[#1E4FA3]" />
      </CardHeader>
      <CardContent className="pt-4">
        <ReactEChartsCore
          key={`yield-${tenors[0]?.yield ?? 0}-${tenors.length}`}
          option={option}
          style={{ height: 220 }}
          notMerge
          opts={{ renderer: "canvas" }}
        />
        <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[#EBF0F7]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5F6F85] mb-1">Curve shape</p>
            <StatusBadge label={data.shape} variant={shapeVariant} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5F6F85] mb-1">Steepness (10Y–2Y)</p>
            <StatusBadge label={data.steepness} variant="info" />
          </div>
        </div>
        <AIInsight text={data.aiSummary} />
      </CardContent>
    </Card>
  );
};
