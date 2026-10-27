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
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    legend: {
      data: ["GDP Growth", "Inflation Rate", "Interest Rate", "Treasury Rate"],
      bottom: 0,
      textStyle: { color: "#64748B", fontSize: 11 },
    },
    grid: { top: 20, right: 16, bottom: 40, left: 35, containLabel: true },
    xAxis: {
      type: "category" as const,
      data: data.macroTrends.map((t) => t.year),
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#64748B", fontSize: 11 },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" as const } },
      axisLabel: { color: "#64748B", fontSize: 11, formatter: "{value}%" },
    },
    series: [
      {
        name: "GDP Growth",
        type: "line",
        data: data.macroTrends.map((t) => t.gdp),
        smooth: true,
        lineStyle: { width: 2, color: "#16805B" },
        itemStyle: { color: "#16805B" },
      },
      {
        name: "Inflation Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.inflation),
        smooth: true,
        lineStyle: { width: 2, color: "#C53D3D" },
        itemStyle: { color: "#C53D3D" },
      },
      {
        name: "Interest Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.interest),
        smooth: true,
        lineStyle: { width: 2, color: "#2457D6" },
        itemStyle: { color: "#2457D6" },
      },
      {
        name: "Treasury Rate",
        type: "line",
        data: data.macroTrends.map((t) => t.treasury),
        smooth: true,
        lineStyle: { width: 1.5, type: "dashed" as const, color: "#64748B" },
        itemStyle: { color: "#64748B" },
      },
    ],
    animation: false,
  };

  // 2. Industry Indicators Horizontal Bar Chart Option
  const sortedSegments = [...data.industrySegments].sort((a, b) => a.growthRate - b.growthRate);
  const industryOption = {
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 11 },
    },
    grid: { top: 10, right: 30, bottom: 20, left: 110, containLabel: true },
    xAxis: {
      type: "value" as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" as const } },
      axisLabel: { color: "#64748B", fontSize: 10, formatter: "{value}%" },
    },
    yAxis: {
      type: "category" as const,
      data: sortedSegments.map((s) => s.segment),
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisLabel: { color: "#64748B", fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: sortedSegments.map((s) => s.growthRate),
        itemStyle: {
          color: "#2457D6",
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          color: "#64748B",
          fontSize: 10,
          formatter: "{c}%",
        },
        barWidth: "40%",
      },
    ],
    animation: false,
  };

  return (
    <Card className="col-span-1 lg:col-span-2 border border-[#E2E8F0] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Macroeconomic & industry analysis</CardTitle>
        <Globe className="h-4 w-4 text-[#2457D6]" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">GDP Growth</span>
            <span className="text-lg font-bold text-[#16805B] mt-0.5 block">{formatPct(data.gdpGrowth)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Inflation</span>
            <span className="text-lg font-bold text-[#C53D3D] mt-0.5 block">{formatPct(data.inflationRate)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Interest Rate</span>
            <span className="text-lg font-bold text-[#2457D6] mt-0.5 block">{formatPct(data.interestRate)}</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3">
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Industry Growth</span>
            <span className="text-lg font-bold text-[#172033] mt-0.5 block">{formatPct(data.industryGrowth)}</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#172033] block">
              Macroeconomic trends (GDP vs Inflation vs Policy)
            </span>
            <ReactEChartsCore key={`macro-${data.gdpGrowth}-${data.macroTrends.length}`} option={macroOption} style={{ height: 200 }} notMerge />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#172033] block">
              Industry segment growth rates
            </span>
            <ReactEChartsCore key={`industry-${data.industryGrowth}-${data.industrySegments.length}`} option={industryOption} style={{ height: 200 }} notMerge />
          </div>
        </div>

        {/* Country Risk & Market Sentiments */}
        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold">Country risk rating</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-bold text-[#16805B]">{data.countryRiskRating}</span>
                  <StatusBadge label={data.countryRiskOutlook} variant={getRiskVariant(data.countryRiskRating)} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold">Market sentiment</span>
                <span className="text-sm font-semibold mt-0.5 block text-[#172033]">{data.marketSentiment}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold">Competition</span>
                <span className="text-sm font-semibold mt-0.5 block text-[#172033]">{data.competitionLevel}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#64748B] block font-semibold">Risk score</span>
              <span className="text-lg font-bold text-[#172033]">{data.countryRiskScore.toFixed(1)} / 100</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {data.countryRiskDescription}
          </p>
        </div>

        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};

