// Liquidity Coverage Ratio (LCR) Gauge Widget
import React from "react";
import ReactEChartsCore from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LCRVM } from "../types";
import { StatusBadge, MetricRow, AIInsight, getComplianceVariant } from "./shared";
import { ShieldCheck } from "lucide-react";

interface Props {
  data: LCRVM;
}

export const LiquidityCoverageWidget: React.FC<Props> = ({ data }) => {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 200,
        radius: "100%",
        center: ["50%", "85%"],
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.5, "hsl(352 82% 54%)"], // < 100% Critical Red
              [0.7, "hsl(272 85% 65%)"],  // Warning buffer Purple
              [1, "hsl(142 76% 45%)"],   // Strong compliant Green
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,80.1c1.2,7.8-4,14.9-11.8,16.1c-0.8,0.1-1.5,0.1-2.3,0l-12-80.1C-1.2,9-0.1,1.2,7.7,0C8.5-0.1,9.3-0.1,10.1,0C11.1,0.1,12,0.3,12.8,0.7z",
          length: "75%",
          width: 4,
          offsetCenter: [0, 5],
          itemStyle: {
            color: "hsl(272 20% 70%)",
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, -15],
          fontSize: 22,
          fontWeight: "bold",
          formatter: "{value}%",
          color: "hsl(0 0% 98%)",
        },
        data: [{ value: data.ratio }],
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Liquidity Coverage Ratio (LCR)</CardTitle>
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-center" style={{ height: 120 }}>
          <ReactEChartsCore key={`lcr-${data.ratio}`} option={option} style={{ height: "100%", width: "100%" }} notMerge />
        </div>
        <div className="flex justify-between items-center mb-3">
          <StatusBadge label={data.complianceStatus} variant={getComplianceVariant(data.complianceStatus)} />
          <span className="text-[10px] text-muted-foreground">Required: {data.requiredThreshold}%</span>
        </div>
        <MetricRow label="Regulatory Buffer" value={`+${data.buffer.toFixed(1)}%`} />
        <MetricRow label="Health Score" value={data.regulatoryHealth} />
        <AIInsight text={data.aiAssessment} />
      </CardContent>
    </Card>
  );
};
