// Forecast Summary radar chart widget
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ForecastSummaryVM } from "../types";
import { StatusBadge } from "./shared";
import { Award } from "lucide-react";

interface Props {
  data: ForecastSummaryVM;
}

export const ForecastSummaryWidget: React.FC<Props> = ({ data }) => {
  const option = {
    tooltip: {
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    radar: {
      indicator: [
        { name: "Financial Strength", max: 100 },
        { name: "Profitability", max: 100 },
        { name: "Macroeconomic Health", max: 100 },
        { name: "Industry Growth", max: 100 },
        { name: "Country Stability", max: 100 },
        { name: "Forecast Confidence", max: 100 },
      ],
      shape: "circle",
      splitNumber: 4,
      axisName: {
        color: "#64748B",
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: "#E2E8F0",
        },
      },
      splitArea: { show: false },
      axisLine: {
        lineStyle: {
          color: "#E2E8F0",
        },
      },
    },
    series: [
      {
        name: "Enterprise Composite Score",
        type: "radar",
        data: [
          {
            value: [
              data.financialStrength,
              data.profitability,
              data.macroeconomicHealth,
              data.industryGrowth,
              data.countryStability,
              data.forecastConfidence,
            ],
            name: "Score Indicators",
            areaStyle: {
              color: "rgba(36, 87, 214, 0.12)",
            },
            lineStyle: {
              color: "#2457D6",
              width: 2,
            },
            itemStyle: {
              color: "#2457D6",
            },
          },
        ],
      },
    ],
  };

  return (
    <Card className="col-span-1 lg:col-span-1 border border-[#E2E8F0] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Forecast composite rating</CardTitle>
        <Award className="h-4 w-4 text-[#2457D6]" />
      </CardHeader>
      <CardContent className="pt-4 flex flex-col justify-between h-[calc(100%-48px)] space-y-4">
        {/* Radar Visual */}
        <div style={{ height: 200 }} className="w-full">
          <ReactEChartsCore key={`forecast-radar-${data.overallScore}-${data.financialStrength}`} option={option} style={{ height: "100%", width: "100%" }} notMerge />
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Composite Score</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#172033]">{data.overallScore} / 100</span>
              <StatusBadge label={`Grade ${data.grade}`} variant={data.grade === "A" ? "success" : "warning"} />
            </div>
          </div>
          <div className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded leading-relaxed">
            {data.summaryText}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

