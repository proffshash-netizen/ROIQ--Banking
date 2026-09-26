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

  const bankingColors = [
    "#1E4FA3", // Primary blue
    "#2F6FD6", // Mid blue
    "#238B5B", // Green
    "#C98A16", // Amber
    "#5F6F85", // Slate
    "#C74646", // Risk red
  ];

  const option = {
    tooltip: {
      trigger: "item" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
      formatter: (params: { name: string; value: number; percent: number }) =>
        `<strong>${params.name}</strong><br/>Value: ${formatCurrency(params.value)} (${params.percent.toFixed(1)}%)`,
    },
    legend: {
      orient: "vertical" as const,
      right: 0,
      top: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: "#5F6F85", fontSize: 11 },
      formatter: (name: string) => {
        const item = filteredAllocation.find(a => a.name === name);
        return item ? `${name}  ${formatCurrency(item.value)}` : name;
      },
    },
    series: [
      {
        name: "Asset Allocation",
        type: "pie",
        radius: ["48%", "68%"],
        center: ["30%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 3,
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 11, fontWeight: "bold", color: "#172033" },
        },
        labelLine: { show: false },
        data: filteredAllocation,
        color: bankingColors,
      },
    ],
    animation: false,
  };

  return (
    <Card className="col-span-1 md:col-span-2 border border-[#D9E1EA] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D9E1EA]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Asset allocation distribution</CardTitle>
        <PieChart className="h-4 w-4 text-[#1E4FA3]" />
      </CardHeader>
      <CardContent className="pt-4">
        {/* Donut chart — use % height relative to parent, not fixed px */}
        <ReactEChartsCore
          key={`portfolio-${data.totalPortfolio}-${filteredAllocation.length}`}
          option={option}
          style={{ height: 200, width: "100%" }}
          notMerge
          opts={{ renderer: "canvas" }}
        />
        <div className="mt-3 pt-3 border-t border-[#EBF0F7] space-y-0.5">
          <MetricRow label="Total Portfolio"    value={formatCurrency(data.totalPortfolio)} />
          <MetricRow label="Treasury Portfolio" value={formatCurrency(data.treasurySecurities)} />
          <MetricRow label="Liquid Cash Assets" value={formatCurrency(data.liquidAssets)} />
          <div className="flex items-center justify-between pt-2 border-t border-[#EBF0F7]">
            <span className="text-xs text-[#5F6F85]">Diversification rating</span>
            <StatusBadge label={data.diversificationScore} variant="success" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F6F85]">Portfolio rating</span>
            <StatusBadge label={data.portfolioRating} variant="info" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
