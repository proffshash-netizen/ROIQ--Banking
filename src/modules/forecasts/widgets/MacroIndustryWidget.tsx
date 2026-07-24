// Macroeconomic & Industry Analysis Widget
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MacroIndustryVM } from "../types";
import { formatPct } from "../transformers";
import { StatusBadge, AIInsight, getRiskVariant } from "./shared";
import { Globe } from "lucide-react";

interface Props {
  data: MacroIndustryVM;
}

export const MacroIndustryWidget: React.FC<Props> = ({ data }) => {
  // 1. Macroeconomic Multi-line Chart Option
  const macroOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "hsl(240 10% 8%)",
      borderColor: "hsl(240 3.7% 20%)",
      textStyle: { color: "hsl(0 0% 90%)", fontSize: 11 },
    },
    legend: {
      data: ["GDP Growth", "Inflation Rate", "Interest Rate", "Treasury Rate"],
      bottom: 0,
      textStyle: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    grid: { top: 20, right: 16, bottom: 40, left: 40 },
    xAxis: {
      type: "category" as const,
      data: data.macroTrends.map((t) => t.year),
      axisLine: { lineStyle: { color: "hsl(240 3.7% 20%)" } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(240 3.7% 15%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10, formatter: "{value}%" },
    },
    series: [
      {
        name: "GDP Growth",
        type: "line",
        data: data.macroTrends.map((t) => t.gdp),
        smooth: true,
        itemStyle: { color: "hsl(160 60% 45%)" },
      },
      {
        name: "Inflation Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.inflation),
        smooth: true,
        itemStyle: { color: "hsl(340 75% 55%)" },
      },
      {
        name: "Interest Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.interest),
        smooth: true,
        itemStyle: { color: "hsl(220 70% 50%)" },
      },
      {
        name: "Treasury Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.treasury),
        smooth: true,
        itemStyle: { color: "hsl(30 80% 55%)" },
      },
    ],
  };

  // 2. Industry Indicators Horizontal Bar Chart Option
  const sortedSegments = [...data.industrySegments].sort((a, b) => a.growthRate - b.growthRate);
  const industryOption = {
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      backgroundColor: "hsl(240 10% 8%)",
      borderColor: "hsl(240 3.7% 20%)",
      textStyle: { color: "hsl(0 0% 90%)", fontSize: 11 },
    },
    grid: { top: 10, right: 30, bottom: 20, left: 130 },
    xAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "hsl(240 3.7% 15%)", type: "dashed" as const } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 9, formatter: "{value}%" },
    },
    yAxis: {
      type: "category" as const,
      data: sortedSegments.map((s) => s.segment),
      axisLine: { lineStyle: { color: "hsl(240 3.7% 20%)" } },
      axisLabel: { color: "hsl(240 5% 64.9%)", fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: sortedSegments.map((s) => s.growthRate),
        itemStyle: {
          color: "hsl(280 65% 60%)",
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          color: "hsl(240 5% 64.9%)",
          fontSize: 9,
          formatter: "{c}%",
        },
      },
    ],
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Macroeconomic & Industry Analysis</CardTitle>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">GDP Growth</span>
            <span className="text-lg font-bold text-emerald-400">{formatPct(data.gdpGrowth)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Inflation</span>
            <span className="text-lg font-bold text-rose-400">{formatPct(data.inflationRate)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Interest Rate</span>
            <span className="text-lg font-bold text-blue-400">{formatPct(data.interestRate)}</span>
          </div>
          <div className="bg-muted/30 border border-border/40 rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Industry Growth</span>
            <span className="text-lg font-bold text-purple-400">{formatPct(data.industryGrowth)}</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Macroeconomic Trends (GDP vs Inflation vs Interest)
            </span>
            <ReactEChartsCore key={`macro-${data.gdpGrowth}-${data.macroTrends.length}`} option={macroOption} style={{ height: 200 }} notMerge />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Industry Segment Growth Rates
            </span>
            <ReactEChartsCore key={`industry-${data.industryGrowth}-${data.industrySegments.length}`} option={industryOption} style={{ height: 200 }} notMerge />
          </div>
        </div>

        {/* Country Risk & Market Sentiments */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Country Risk Rating</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-bold text-emerald-400">{data.countryRiskRating}</span>
                  <StatusBadge label={data.countryRiskOutlook} variant={getRiskVariant(data.countryRiskRating)} />
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Market Sentiment</span>
                <span className="text-sm font-bold mt-0.5 block text-blue-400">{data.marketSentiment}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Competition</span>
                <span className="text-sm font-bold mt-0.5 block">{data.competitionLevel}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Country Risk Score</span>
              <span className="text-lg font-bold">{data.countryRiskScore.toFixed(1)}/100</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            {data.countryRiskDescription}
          </p>
        </div>

        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};
