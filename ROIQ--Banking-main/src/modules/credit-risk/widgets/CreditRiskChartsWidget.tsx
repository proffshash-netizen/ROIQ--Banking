// Credit Risk – Credit Risk Charts Widget
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CreditRiskVM } from "../types";

interface Props {
  data: CreditRiskVM;
}

export const CreditRiskChartsWidget: React.FC<Props> = ({ data }) => {
  const debtRatiosOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 12 },
    },
    legend: {
      data: ["Actual", "Benchmark threshold"],
      bottom: 0,
      textStyle: { color: "#64748B", fontSize: 11 },
    },
    grid: { top: 20, right: 20, bottom: 40, left: 40, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: data.debtRatios.map((r) => r.name),
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#64748B", fontSize: 11 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" as const } },
      axisLabel: { color: "#64748B", fontSize: 11 },
    },
    series: [
      {
        name: "Actual",
        type: "bar",
        data: data.debtRatios.map((r) => ({
          value: r.value,
          itemStyle: {
            color: r.value > r.threshold ? "#C53D3D" : "#16805B",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: 24,
      },
      {
        name: "Benchmark threshold",
        type: "bar",
        data: data.debtRatios.map((r) => r.threshold),
        itemStyle: { color: "#94A3B8", borderRadius: [4, 4, 0, 0] },
        barWidth: 24,
      },
    ],
    animation: false,
  };

  return (
    <div>
      <Card className="border border-[#E2E8F0] bg-white">
        <CardHeader className="pb-2 border-b border-[#E2E8F0]">
          <CardTitle className="text-sm font-semibold text-[#172033]">Debt ratios vs covenants</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ReactEChartsCore key={`credit-bar-${data.debtRatios.map(r => r.value).join('-')}`} option={debtRatiosOption} style={{ height: 220 }} notMerge />
        </CardContent>
      </Card>
    </div>
  );
};

