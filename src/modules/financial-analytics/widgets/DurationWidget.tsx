// Duration Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DurationVM } from "../types";
import { StatusBadge, MetricRow, AIInsight, getRiskVariant } from "./shared";
import { Timer } from "lucide-react";

interface Props {
  data: DurationVM;
}

export const DurationWidget: React.FC<Props> = ({ data }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Duration Analysis</CardTitle>
      <Timer className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Portfolio Duration</p>
          <p className="text-3xl font-bold tracking-tight">{data.portfolioDuration.toFixed(2)}<span className="text-sm font-normal text-muted-foreground ml-1">yrs</span></p>
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
