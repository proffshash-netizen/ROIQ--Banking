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
  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(240 10% 8%)",
      borderColor: "hsl(240 3.7% 20%)",
      textStyle: { color: "hsl(0 0% 90%)", fontSize: 11 },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0];
        return `<strong>${p.name}</strong><br/>Yield: ${p.value.toFixed(2)}%`;
      },
    },
    grid: { top: 20, right: 20, bottom: 30, left: 40, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: data.tenors.map((t) => t.label),
      axisLine: { lineStyle: { color: "hsl(240 3.7% 20%)" } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      min: (v: { min: number }) => Math.floor(v.min * 10 - 2) / 10,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(240 3.7% 15%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10, formatter: "{value}%" },
    },
    series: [
      {
        type: "line",
        data: data.tenors.map((t) => t.yield),
        smooth: 0.4,
        lineStyle: { width: 3, color: "hsl(280 65% 60%)" },
        itemStyle: { color: "hsl(280 65% 60%)" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "hsla(280 65% 60% / 0.25)" },
              { offset: 1, color: "hsla(280 65% 60% / 0.02)" },
            ],
          },
        },
        symbolSize: 6,
      },
    ],
    animation: true,
    animationDuration: 1000,
  };

  const shapeVariant = data.shape.toLowerCase().includes("inverted") ? "danger" : data.shape.toLowerCase().includes("flat") ? "warning" : "success";

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Yield Curve</CardTitle>
        <GitBranch className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ReactEChartsCore key={`yield-${data.tenors[0]?.yield ?? 0}-${data.tenors.length}`} option={option} style={{ height: 220 }} notMerge />
        <div className="flex items-center gap-3 mt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Shape</p>
            <StatusBadge label={data.shape} variant={shapeVariant} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Steepness</p>
            <StatusBadge label={data.steepness} variant="info" />
          </div>
        </div>
        <AIInsight text={data.aiSummary} />
      </CardContent>
    </Card>
  );
};
