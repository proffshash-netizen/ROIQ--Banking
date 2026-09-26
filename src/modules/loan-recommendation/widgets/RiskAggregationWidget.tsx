// Section 2: Risk Aggregation Engine Widget
// Visualizes aggregated risk metrics across all modules using horizontal bar chart, overall risk gauge, and distribution table.

import React from "react";
import ReactECharts from "echarts-for-react";
import type { RiskAggregationVM } from "../types";
import { SectionHeader, RiskBadge, AISummaryCard, getRiskColor } from "./shared";
import { ShieldAlert, BarChart3, Gauge, Table as TableIcon, CheckCircle2 } from "lucide-react";

interface RiskAggregationWidgetProps {
  data: RiskAggregationVM;
}

export const RiskAggregationWidget: React.FC<RiskAggregationWidgetProps> = ({ data }) => {
  // Horizontal Bar Chart Options (Risk Contribution by Module)
  const barChartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any[]) => {
        const item = params[0];
        const module = data.moduleBreakdowns.find((m) => m.moduleName === item.name);
        return `
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #fff;">${item.name}</div>
          <div style="font-size: 11px; color: #9ca3af;">Risk Score: <strong style="color: ${item.color}">${item.value}/100</strong></div>
          <div style="font-size: 11px; color: #9ca3af;">Weight: <strong>${module?.weightPct}%</strong></div>
          <div style="font-size: 11px; color: #9ca3af;">Weighted Impact: <strong>${module?.weightedContribution} pts</strong></div>
        `;
      },
    },
    grid: {
      top: 15,
      right: 35,
      bottom: 25,
      left: 170,
      containLabel: false,
    },
    xAxis: {
      type: "value",
      max: 100,
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.08)" } },
      axisLabel: { color: "#9ca3af", fontSize: 10 },
    },
    yAxis: {
      type: "category",
      data: data.moduleBreakdowns.map((m) => m.moduleName).reverse(),
      axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
      axisLabel: { color: "#e5e7eb", fontSize: 11, fontWeight: 500 },
    },
    series: [
      {
        name: "Risk Score",
        type: "bar",
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: (params: any) => {
            const item = data.moduleBreakdowns.slice().reverse()[params.dataIndex];
            return getRiskColor(item.riskLevel);
          },
        },
        label: {
          show: true,
          position: "right",
          color: "#9ca3af",
          fontSize: 11,
          fontWeight: 600,
          formatter: "{c} / 100",
        },
        data: data.moduleBreakdowns.map((m) => m.riskScore).reverse(),
      },
    ],
  };

  // Overall Risk Gauge Chart Options
  const gaugeChartOption = {
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: getRiskColor(data.overallRiskLevel),
        },
        progress: {
          show: true,
          width: 14,
        },
        pointer: {
          show: true,
          length: "60%",
          width: 5,
          itemStyle: { color: "#e5e7eb" },
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [0.3, "hsl(142 76% 45%)"], // Low (Green)
              [0.6, "hsl(272 85% 65%)"], // Medium (Purple)
              [0.8, "hsl(352 82% 54%)"], // High (Red)
              [1.0, "hsl(350 85% 42%)"], // Critical (Dark Red)
            ],
          },
        },
        axisTick: { show: false },
        splitLine: {
          length: 8,
          lineStyle: { width: 1.5, color: "rgba(255, 255, 255, 0.3)" },
        },
        axisLabel: {
          distance: 12,
          color: "#9ca3af",
          fontSize: 9,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "#fff",
          fontSize: 26,
          fontWeight: "bold",
          offsetCenter: [0, "-10%"],
        },
        data: [{ value: data.overallRiskScore, name: "Risk Score" }],
      },
    ],
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-6">
      <SectionHeader
        title="SECTION 2: RISK AGGREGATION ENGINE"
        subtitle="Aggregated risk synthesis across corporate, liquidity, market, and credit risk modules"
        badgeText="Analytical Aggregation"
        icon={<ShieldAlert className="h-5 w-5 text-purple-400" />}
      />

      {/* Top Aggregation Cards: Overall Score, Risk Level, Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Weighted Overall Risk Score
            </span>
            <div className="text-3xl font-extrabold text-foreground mt-1">
              {data.overallRiskScore} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Weighted aggregate across 6 analytical risk modules
            </p>
          </div>
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
            <Gauge className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Overall Risk Level
            </span>
            <div className="mt-1.5">
              <RiskBadge level={data.overallRiskLevel} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Composite credit risk classification profile
            </p>
          </div>
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Confidence Score
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {data.confidenceScore}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Statistical confidence based on data completeness
            </p>
          </div>
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Visualizations Grid: Horizontal Bar Chart & Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-muted/10 p-4">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span>Module Risk Score Breakdown</span>
          </div>
          <ReactECharts key={`risk-bar-${data.overallRiskScore}-${data.moduleBreakdowns.map(m => m.riskScore).join('-')}`} option={barChartOption} style={{ height: "260px", width: "100%" }} notMerge />
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-foreground self-start">
            <Gauge className="h-4 w-4 text-purple-400" />
            <span>Overall Risk Gauge</span>
          </div>
          <ReactECharts key={`risk-gauge-${data.overallRiskScore}-${data.overallRiskLevel}`} option={gaugeChartOption} style={{ height: "210px", width: "100%" }} notMerge />
          <div className="text-center text-xs text-muted-foreground -mt-4">
            Aggregated Risk Score: <strong className="text-foreground">{data.overallRiskScore}</strong>
          </div>
        </div>
      </div>

      {/* Risk Distribution Table */}
      <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
          <TableIcon className="h-4 w-4 text-purple-400" />
          <span>Risk Distribution Table</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold bg-muted/30">
                <th className="py-2.5 px-3">Analytical Module</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Raw Risk Score</th>
                <th className="py-2.5 px-3">Weight (%)</th>
                <th className="py-2.5 px-3">Weighted Impact</th>
                <th className="py-2.5 px-3">Module Status</th>
                <th className="py-2.5 px-3">AI Module Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.moduleBreakdowns.map((m, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{m.moduleName}</td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={m.riskLevel} />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{m.riskScore} / 100</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{m.weightPct}%</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">{m.weightedContribution} pts</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate" title={m.aiSummary}>
                    {m.aiSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AISummaryCard text={data.aiInterpretation} title="AI Summary – Risk Aggregation Synthesis" />
    </div>
  );
};
