// Duration Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DurationVM } from "../types";
import { StatusBadge, MetricRow, AIInsight, getRiskVariant } from "./shared";
import { Clock } from "lucide-react";

interface Props {
  data: DurationVM;
}

export const DurationWidget: React.FC<Props> = ({ data }) => (
  <Card className="border border-[#E2E8F0] bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
      <CardTitle className="text-sm font-semibold text-[#172033]">Duration & interest rate risk</CardTitle>
      <Clock className="h-4 w-4 text-[#2457D6]" />
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[#64748B]">Portfolio duration</p>
          <p className="text-2xl font-bold font-mono text-[#172033] mt-0.5">{data.portfolioDuration.toFixed(2)}<span className="text-sm font-normal text-[#64748B] ml-1">years</span></p>
        </div>
        <StatusBadge label={data.riskLevel} variant={getRiskVariant(data.riskLevel)} />
      </div>
      <MetricRow label="Modified Duration" value={`${data.modifiedDuration.toFixed(2)} yrs`} />
      <MetricRow label="Macaulay Duration" value={`${data.macaulayDuration.toFixed(2)} yrs`} />
      <MetricRow label="Convexity" value={data.convexity.toFixed(1)} />
      <MetricRow label="IR Sensitivity" value={data.interestRateSensitivity} />
      <AIInsight text={data.aiAssessment} />
    </CardContent>
  </Card>
);

