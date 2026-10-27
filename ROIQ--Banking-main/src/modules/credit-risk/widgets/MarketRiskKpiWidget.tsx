// Credit Risk – Market Risk KPI Cards Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MarketRiskVM } from "../types";
import { RiskBadge, TrendIndicator, AIInsight, SectionHeader } from "./shared";
import { BarChart3, Shield } from "lucide-react";

interface Props {
  data: MarketRiskVM;
}

export const MarketRiskKpiWidget: React.FC<Props> = ({ data }) => (
  <>
    <SectionHeader
      title="Market Risk Analysis"
      subtitle={`Company: ${data.companyId} · ${data.instrumentCount} instruments tracked`}
      icon={<BarChart3 className="h-5 w-5 text-purple-400" />}
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {data.kpis.map((kpi) => (
        <Card key={kpi.label} className="group hover:border-border/80 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-[11px] font-medium text-muted-foreground leading-tight truncate">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight">{kpi.formattedValue}</span>
              {kpi.unit && kpi.unit !== "USD" && kpi.unit !== "ratio" && kpi.unit !== "" && (
                <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <RiskBadge level={kpi.riskLevel} />
              <TrendIndicator direction={kpi.trend} value={kpi.trendPct} />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
              {kpi.interpretation}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Market Risk Summary Card */}
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Market Risk Executive Summary</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Rating</p>
            <RiskBadge level={data.summary.riskRating} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Primary Driver</p>
            <p className="text-sm font-medium">{data.summary.primaryDriver}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Largest Exposure</p>
            <p className="text-sm font-medium">{data.summary.largestExposure}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Trend</p>
            <TrendIndicator direction={data.summary.riskTrend} />
          </div>
        </div>
        <AIInsight text={data.summary.aiInterpretation} />
      </CardContent>
    </Card>
  </>
);
