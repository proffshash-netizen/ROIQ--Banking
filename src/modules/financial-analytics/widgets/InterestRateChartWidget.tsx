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
  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(272 38% 8%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(272 20% 92%)", fontSize: 11 },
    },
    legend: {
      data: ["Policy Rate", "Market Rate", "Overnight Rate"],
      bottom: 0,
      textStyle: { color: "hsl(272 20% 70%)", fontSize: 10 },
    },
    grid: { top: 10, right: 16, bottom: 40, left: 40, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: data.historicalTrend.map((p) => p.date),
      axisLine: { lineStyle: { color: "hsl(272 30% 20%)" } },
      axisLabel: { color: "hsl(272 20% 70%)", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      min: (v: { min: number }) => Math.floor(v.min * 10 - 1) / 10,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(272 30% 16%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(272 20% 70%)", fontSize: 10, formatter: "{value}%" },
    },
    series: [
      {
        name: "Policy Rate",
        type: "line",
        data: data.historicalTrend.map((p) => p.policy),
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "hsl(272 85% 65%)" },
        areaStyle: { color: "hsla(272 85% 65% / 0.12)" },
      },
      {
        name: "Market Rate",
        type: "line",
        data: data.historicalTrend.map((p) => p.market),
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "hsl(142 76% 45%)" },
        areaStyle: { color: "hsla(142 76% 45% / 0.12)" },
      },
      {
        name: "Overnight Rate",
        type: "line",
        data: data.historicalTrend.map((p) => p.overnight),
        smooth: true,
        lineStyle: { width: 2, type: "dashed" as const },
        itemStyle: { color: "hsl(352 82% 54%)" },
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Interest Rate Trends</CardTitle>
        <TrendingUp className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <ReactEChartsCore key={`ir-${data.policyRate}-${data.historicalTrend.length}`} option={option} style={{ height: 260 }} notMerge />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <MetricRow label="Policy Rate" value={formatPct(data.policyRate)} />
          <MetricRow label="Market Rate" value={formatPct(data.marketRate)} />
          <MetricRow label="Overnight Rate" value={formatPct(data.overnightRate)} />
          <MetricRow label="Average Rate" value={formatPct(data.averageRate)} />
          <MetricRow label="Highest Rate" value={formatPct(data.highestRate)} />
          <MetricRow label="Lowest Rate" value={formatPct(data.lowestRate)} />
        </div>
        <AIInsight text={data.aiInterpretation} />
      </CardContent>
    </Card>
  );
};
