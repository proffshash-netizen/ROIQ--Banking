// Credit Risk – Market Risk Charts Widget
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MarketRiskVM } from "../types";
import { formatCurrency, formatBps } from "../transformers";
import { MetricRow } from "./shared";

interface Props {
  data: MarketRiskVM;
}

export const MarketRiskChartsWidget: React.FC<Props> = ({ data }) => {
  const donutOption = {
    tooltip: {
      trigger: "item" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 12 },
      formatter: (p: { name: string; value: number; percent: number }) =>
        `${p.name}: ${formatCurrency(p.value)} (${p.percent.toFixed(1)}%)`,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "75%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 4, borderColor: "#FFFFFF", borderWidth: 2 },
        label: {
          show: true,
          color: "#64748B",
          fontSize: 11,
          formatter: "{b}: {d}%",
        },
        data: [
          { value: data.exposureBreakdown.hedged, name: "Hedged", itemStyle: { color: "#16805B" } },
          { value: data.exposureBreakdown.unhedged, name: "Unhedged", itemStyle: { color: "#C53D3D" } },
        ],
      },
    ],
    animation: false,
  };

  return (
    <div>
      <Card className="border border-[#E2E8F0] bg-white">
        <CardHeader className="pb-2 border-b border-[#E2E8F0]">
          <CardTitle className="text-sm font-semibold text-[#172033]">Exposure distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ReactEChartsCore key={`market-donut-${data.exposureBreakdown.hedged}-${data.exposureBreakdown.unhedged}`} option={donutOption} style={{ height: 220 }} notMerge />
          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">Cross-currency basis</p>
            <MetricRow label="USD / EUR basis" value={formatBps(data.crossCurrencyBasis)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

