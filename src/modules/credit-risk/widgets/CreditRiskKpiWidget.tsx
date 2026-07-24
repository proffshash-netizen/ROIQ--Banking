// Credit Risk – Credit Risk KPI Cards Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CreditRiskVM } from "../types";
import { RiskBadge, AIInsight, SectionHeader } from "./shared";
import { CreditCard, FileCheck } from "lucide-react";

interface Props {
  data: CreditRiskVM;
}

export const CreditRiskKpiWidget: React.FC<Props> = ({ data }) => (
  <>
    <SectionHeader
      title="Credit Risk Assessment"
      subtitle={`Credit Rating: ${data.creditRating} · Risk Category: ${data.riskCategory}`}
      icon={<CreditCard className="h-5 w-5 text-amber-400" />}
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
              {kpi.unit && kpi.unit !== "USD" && kpi.unit !== "ratio" && kpi.unit !== "" && kpi.unit !== "points" && (
                <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>
              )}
            </div>
            <RiskBadge level={kpi.riskLevel} />
            <p className="text-[10px] text-muted-foreground leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
              {kpi.interpretation}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Credit Risk Summary Card */}
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Credit Risk Executive Summary</CardTitle>
        <FileCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Rating</p>
            <p className="text-sm font-bold">{data.summary.currentRating}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Probability of Default</p>
            <p className="text-sm font-medium">{data.summary.probabilityOfDefault.toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Financial Leverage</p>
            <p className="text-sm font-medium">{data.summary.financialLeverage}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Repayment Quality</p>
            <p className="text-sm font-medium">{data.summary.repaymentQuality}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Debt Burden</p>
            <p className="text-sm font-medium">{data.summary.debtBurden}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Credit Outlook</p>
            <p className="text-sm font-medium">{data.summary.creditOutlook}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Classification</p>
            <RiskBadge level={data.summary.riskClassification} />
          </div>
        </div>
        <AIInsight text={data.summary.aiInterpretation} />
      </CardContent>
    </Card>
  </>
);
