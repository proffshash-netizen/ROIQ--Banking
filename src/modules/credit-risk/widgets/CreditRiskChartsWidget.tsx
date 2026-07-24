// Credit Risk – Credit Risk Charts Widget
// Debt Structure, Debt Ratios, Credit Utilization Gauge, Rating History
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CreditRiskVM } from "../types";


interface Props {
  data: CreditRiskVM;
}

export const CreditRiskChartsWidget: React.FC<Props> = ({ data }) => {
  // Debt Ratios – Bar Chart with threshold markers
  const debtRatiosOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(240 10% 8%)",
      borderColor: "hsl(240 3.7% 20%)",
      textStyle: { color: "hsl(0 0% 90%)", fontSize: 11 },
    },
    legend: {
      data: ["Actual", "Threshold"],
      bottom: 0,
      textStyle: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    grid: { top: 20, right: 30, bottom: 40, left: 50, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: data.debtRatios.map((r) => r.name),
      axisLine: { lineStyle: { color: "hsl(240 3.7% 20%)" } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(240 3.7% 15%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    series: [
      {
        name: "Actual",
        type: "bar",
        data: data.debtRatios.map((r) => ({
          value: r.value,
          itemStyle: {
            color: r.value > r.threshold ? "hsl(0 70% 55%)" : "hsl(160 60% 45%)",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: 28,
      },
      {
        name: "Threshold",
        type: "bar",
        data: data.debtRatios.map((r) => r.threshold),
        itemStyle: { color: "hsl(240 5% 30%)", borderRadius: [4, 4, 0, 0] },
        barWidth: 28,
      },
    ],
    animation: false,
  };

  return (
    <div>
      {/* Debt Ratios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Debt Ratios vs Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactEChartsCore key={`credit-bar-${data.debtRatios.map(r => r.value).join('-')}`} option={debtRatiosOption} style={{ height: 220 }} notMerge />
        </CardContent>
      </Card>
    </div>
  );
};
