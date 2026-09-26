// Credit Risk – Market Risk Charts Widget
// VaR vs ES comparison, currency exposure breakdown, FX volatility trend, exposure donut
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
  // Exposure Distribution – Donut
  const donutOption = {
    tooltip: {
      trigger: "item" as const,
      backgroundColor: "hsl(272 32% 10%)",
      borderColor: "hsl(272 30% 20%)",
      textStyle: { color: "hsl(270 20% 95%)", fontSize: 11 },
      formatter: (p: { name: string; value: number; percent: number }) =>
        `${p.name}: ${formatCurrency(p.value)} (${p.percent.toFixed(1)}%)`,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "78%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 4, borderColor: "hsl(272 38% 6%)", borderWidth: 2 },
        label: {
          show: true,
          color: "hsl(272 15% 68%)",
          fontSize: 10,
          formatter: "{b}: {d}%",
        },
        data: [
          { value: data.exposureBreakdown.hedged, name: "Hedged", itemStyle: { color: "hsl(142 76% 45%)" } },
          { value: data.exposureBreakdown.unhedged, name: "Unhedged", itemStyle: { color: "hsl(352 82% 54%)" } },
        ],
      },
    ],
    animation: false,
  };

  return (
    <div>
      {/* Exposure Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Exposure Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactEChartsCore key={`market-donut-${data.exposureBreakdown.hedged}-${data.exposureBreakdown.unhedged}`} option={donutOption} style={{ height: 220 }} notMerge />
          {/* Cross-Currency Basis Table */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cross-Currency Basis</p>
            <MetricRow label="USD/EUR Basis" value={formatBps(data.crossCurrencyBasis)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
