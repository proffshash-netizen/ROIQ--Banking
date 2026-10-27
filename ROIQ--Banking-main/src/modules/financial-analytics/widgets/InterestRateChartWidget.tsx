// Interest Rate Chart Widget – ECharts Area/Line Chart
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { InterestRateVM } from "../types";
import { formatPct } from "../transformers";
import { MetricRow, AIInsight } from "./shared";
import { TrendingUp } from "lucide-react";

interface Props {
  data: InterestRateVM;
}

export const InterestRateChartWidget: React.FC<Props> = ({ data }) => {
  // Guard: make sure historicalTrend has data
  const trend = data.historicalTrend.length > 0 ? data.historicalTrend : [
    { date: "Jan", policy: data.policyRate, market: data.marketRate, overnight: data.overnightRate },
  ];

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    legend: {
      data: ["Policy Rate", "Market Rate", "Overnight Rate"],
      bottom: 0,
      textStyle: { color: "#5F6F85", fontSize: 11 },
      icon: "rect",
      itemWidth: 14,
      itemHeight: 3,
    },
    grid: { top: 16, right: 16, bottom: 40, left: 10, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: trend.map((p) => p.date),
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
        name: "Policy Rate",
        type: "line",
        data: trend.map((p) => p.policy),
        smooth: true,
        lineStyle: { width: 2.5, color: "#1E4FA3" },
        itemStyle: { color: "#1E4FA3" },
        areaStyle: { color: "rgba(30, 79, 163, 0.08)" },
        symbolSize: 4,
      },
      {
        name: "Market Rate",
        type: "line",
        data: trend.map((p) => p.market),
        smooth: true,
        lineStyle: { width: 2, color: "#238B5B" },
        itemStyle: { color: "#238B5B" },
        areaStyle: { color: "rgba(35, 139, 91, 0.06)" },
        symbolSize: 4,
      },
      {
        name: "Overnight Rate",
        type: "line",
        data: trend.map((p) => p.overnight),
        smooth: true,
        lineStyle: { width: 1.5, type: "dashed" as const, color: "#C74646" },
        itemStyle: { color: "#C74646" },
        symbolSize: 3,
      },
    ],
    animation: false,
  };

  return (
    // lg:col-span-2 keeps it in 2-column span within 3-col grid (doesn't overflow)
    <Card className="col-span-1 md:col-span-2 border border-[#D9E1EA] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D9E1EA]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Interest rate benchmark trends</CardTitle>
        <TrendingUp className="h-4 w-4 text-[#1E4FA3]" />
      </CardHeader>
      <CardContent className="pt-4">
        <ReactEChartsCore
          key={`ir-${data.policyRate}-${trend.length}`}
          option={option}
          style={{ height: 240 }}
          notMerge
          opts={{ renderer: "canvas" }}
        />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3 pt-3 border-t border-[#EBF0F7]">
          <MetricRow label="Policy Rate"    value={formatPct(data.policyRate)} />
          <MetricRow label="Market Rate"    value={formatPct(data.marketRate)} />
          <MetricRow label="Overnight Rate" value={formatPct(data.overnightRate)} />
          <MetricRow label="Average Rate"   value={formatPct(data.averageRate)} />
          <MetricRow label="Highest Rate"   value={formatPct(data.highestRate)} />
          <MetricRow label="Lowest Rate"    value={formatPct(data.lowestRate)} />
        </div>
        <AIInsight text={data.aiInterpretation} />
      </CardContent>
    </Card>
  );
};
