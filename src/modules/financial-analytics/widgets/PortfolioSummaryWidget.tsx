// Portfolio Summary Widget – ECharts Donut Chart
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PortfolioVM } from "../types";
import { formatCurrency } from "../transformers";
import { StatusBadge, MetricRow } from "./shared";
import { PieChart } from "lucide-react";

interface Props {
  data: PortfolioVM;
}

export const PortfolioSummaryWidget: React.FC<Props> = ({ data }) => {
  const filteredAllocation = data.allocation.filter((item) => item.value > 0);

  const option = {
    tooltip: {
      trigger: "item" as const,
      backgroundColor: "hsl(272 38% 8%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(272 20% 92%)", fontSize: 11 },
      formatter: (params: { name: string; value: number; percent: number }) => {
        return `<strong>${params.name}</strong><br/>Value: ${formatCurrency(params.value)} (${params.percent.toFixed(1)}%)`;
      },
    },
    legend: { show: false },
    series: [
      {
        name: "Asset Allocation",
        type: "pie",
        radius: ["55%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "hsl(272 38% 6%)",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
            color: "hsl(0 0% 98%)",
          },
        },
        labelLine: { show: false },
        data: filteredAllocation,
        color: [
          "hsl(272 85% 65%)",
          "hsl(142 76% 45%)",
          "hsl(352 82% 54%)",
          "hsl(285 85% 72%)",
          "hsl(158 80% 36%)",
          "hsl(348 85% 42%)",
        ],
      },
    ],
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
        <PieChart className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-48px)]">
        <div className="flex items-center gap-4">
          <div style={{ height: 140, width: 140, position: "relative" }} className="flex-shrink-0">
            <ReactEChartsCore key={`portfolio-${data.totalPortfolio}`} option={option} style={{ height: "100%", width: "100%" }} notMerge />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground">Total Assets</span>
              <span className="text-sm font-bold">{formatCurrency(data.totalPortfolio)}</span>
            </div>
          </div>
          <div className="flex-grow space-y-1">
            <MetricRow label="Treasury Portfolio" value={formatCurrency(data.treasurySecurities)} />
            <MetricRow label="Liquid Cash Assets" value={formatCurrency(data.liquidAssets)} />
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-muted-foreground">Diversification</span>
              <StatusBadge label={data.diversificationScore} variant="success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Rating</span>
              <StatusBadge label={data.portfolioRating} variant="info" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
