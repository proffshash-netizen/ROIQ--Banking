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
      backgroundColor: "hsl(272 38% 8%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(272 20% 92%)", fontSize: 11 },
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
        color: "hsl(272 20% 70%)",
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: [
            "hsla(272 40% 60% / 0.1)",
            "hsla(272 40% 60% / 0.15)",
            "hsla(272 40% 60% / 0.2)",
            "hsla(272 40% 60% / 0.25)",
          ],
        },
      },
      splitArea: { show: false },
      axisLine: {
        lineStyle: {
          color: "hsla(272 40% 60% / 0.15)",
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
              color: "hsla(272 85% 65% / 0.2)",
            },
            lineStyle: {
              color: "hsl(272 85% 65%)",
              width: 2,
            },
            itemStyle: {
              color: "hsl(272 85% 65%)",
            },
          },
        ],
      },
    ],
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Forecast Composite Rating</CardTitle>
        <Award className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-48px)] space-y-4">
        {/* Radar Visual */}
        <div style={{ height: 200 }} className="w-full">
          <ReactEChartsCore key={`forecast-radar-${data.overallScore}-${data.financialStrength}`} option={option} style={{ height: "100%", width: "100%" }} notMerge />
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Overall Composite Score</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{data.overallScore}/100</span>
              <StatusBadge label={`Grade ${data.grade}`} variant={data.grade === "A" ? "success" : "warning"} />
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/20 border border-border/40 p-3 rounded-lg leading-relaxed">
            {data.summaryText}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
