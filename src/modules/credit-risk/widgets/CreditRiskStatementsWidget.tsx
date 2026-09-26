// Credit Risk – Detailed Statements & Analysis Summary Widget
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { MarketRiskVM, CreditRiskVM, ExecutiveSummaryVM } from "../types";
import { SectionHeader, AIInsight } from "./shared";
import { FileText, CheckCircle } from "lucide-react";
import { formatCurrency, formatRatio, formatPct } from "../transformers";

interface Props {
  marketRisk: MarketRiskVM;
  creditRisk: CreditRiskVM;
  executiveSummary: ExecutiveSummaryVM;
}

export const CreditRiskStatementsWidget: React.FC<Props> = ({
  marketRisk,
  creditRisk,
  executiveSummary,
}) => {
  return (
    <div className="space-y-6">
      {/* Comprehensive Loan & Credit Risk Analysis Statement */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <SectionHeader
            title="Loan & Credit Risk Analysis Statement"
            subtitle={`Borrower ID: ${marketRisk.companyId} · Rating: ${creditRisk.creditRating} (${creditRisk.summary.riskClassification} Risk)`}
            icon={<FileText className="h-5 w-5 text-purple-400" />}
          />
        </CardHeader>
        <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
          <div className="p-4 rounded-lg bg-card border border-border space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Executive Loan Underwriting & Counterparty Evaluation
            </h4>
            <p>
              The comprehensive loan credit analysis for <strong>{marketRisk.companyId}</strong> demonstrates a robust financial foundation supported by an official credit rating of <strong>{creditRisk.creditRating}</strong>. The borrower exhibits a low Probability of Default (PD) estimated at <strong>{creditRisk.summary.probabilityOfDefault.toFixed(2)}%</strong> with a historical repayment behavior classified as <strong>"{creditRisk.repaymentBehaviour}"</strong>.
            </p>
            <p>
              With total outstanding debt obligations of <strong>{formatCurrency(creditRisk.debtOutstanding)}</strong>, the borrower maintains an optimal Debt-to-Equity ratio of <strong>{formatRatio(creditRisk.debtToEquity)}</strong> and an Interest Coverage Ratio of <strong>{formatRatio(creditRisk.interestCoverage)}</strong>. Secured collateral guarantees <strong>{formatCurrency(creditRisk.debtStructure.secured)}</strong> of overall exposure, yielding a strong Loss Given Default (LGD) mitigation buffer for underwriting institutions.
            </p>
          </div>

          {/* Underwriting Key Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-muted/20 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Financial Leverage</span>
              <span className="text-sm font-semibold text-foreground mt-1 block">{creditRisk.summary.financialLeverage}</span>
              <p className="text-[10px] text-muted-foreground mt-1">D/E Ratio at {formatRatio(creditRisk.debtToEquity)} against industry threshold of 2.0x.</p>
            </div>

            <div className="p-3 rounded-md bg-muted/20 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Debt Service Capacity</span>
              <span className="text-sm font-semibold text-foreground mt-1 block">{creditRisk.summary.debtBurden}</span>
              <p className="text-[10px] text-muted-foreground mt-1">Coverage of {formatRatio(creditRisk.interestCoverage)}x provides high solvency cushion.</p>
            </div>

            <div className="p-3 rounded-md bg-muted/20 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Credit Facility Draw Rate</span>
              <span className="text-sm font-semibold text-foreground mt-1 block">{formatPct(creditRisk.creditUtilization)}</span>
              <p className="text-[10px] text-muted-foreground mt-1">Conservative utilization of approved liquidity lines.</p>
            </div>
          </div>

          {/* Risk Factors & Positive Indicators Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/15 space-y-2">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Key Credit Strengths</span>
              <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                {executiveSummary.aiExplanation.positiveIndicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-md bg-red-500/5 border border-red-500/15 space-y-2">
              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">Risk Sensitivities & Covenants</span>
              <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                {executiveSummary.aiExplanation.negativeIndicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <AIInsight title="AI Loan Underwriting Rationale" text={executiveSummary.aiExplanation.businessSummary} />
        </CardContent>
      </Card>
    </div>
  );
};

