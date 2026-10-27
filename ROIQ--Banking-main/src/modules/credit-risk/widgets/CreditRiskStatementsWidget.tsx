// Credit Risk – Detailed Statements & Analysis Summary Widget
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { MarketRiskVM, CreditRiskVM, ExecutiveSummaryVM } from "../types";
import { AIInsight } from "./shared";
import { FileText, CheckCircle2 } from "lucide-react";
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
      <Card className="border border-[#E2E8F0] bg-white">
        <CardHeader className="pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded border border-[#E2E8F0] bg-slate-50 text-[#172033]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">Credit analysis statement</h3>
              <p className="text-xs text-[#64748B]">Borrower ID: REF-00{marketRisk.companyId} · Rating: {creditRisk.creditRating} ({creditRisk.summary.riskClassification} Risk)</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 text-xs leading-relaxed text-[#64748B]">
          <div className="p-4 rounded-md bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="font-semibold text-xs text-[#172033] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16805B]" />
              Executive underwriting & counterparty evaluation
            </h4>
            <p>
              The comprehensive credit evaluation for <strong className="text-[#172033]">{marketRisk.companyId}</strong> demonstrates a structured financial position with an official rating of <strong className="text-[#172033]">{creditRisk.creditRating}</strong>. The borrower exhibits an estimated Probability of Default (PD) of <strong className="text-[#172033]">{creditRisk.summary.probabilityOfDefault.toFixed(2)}%</strong> with repayment behavior characterized as <span className="text-[#172033]">"{creditRisk.repaymentBehaviour}"</span>.
            </p>
            <p>
              With total outstanding debt obligations of <strong className="text-[#172033]">{formatCurrency(creditRisk.debtOutstanding)}</strong>, the borrower maintains an evaluated Debt-to-Equity ratio of <strong className="text-[#172033]">{formatRatio(creditRisk.debtToEquity)}</strong> and an Interest Coverage ratio of <strong className="text-[#172033]">{formatRatio(creditRisk.interestCoverage)}</strong>. Secured collateral covers <strong className="text-[#172033]">{formatCurrency(creditRisk.debtStructure.secured)}</strong> of overall exposure.
            </p>
          </div>

          {/* Underwriting Key Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-white border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Financial leverage</span>
              <span className="text-sm font-semibold text-[#172033] mt-1 block">{creditRisk.summary.financialLeverage}</span>
              <p className="text-[11px] text-[#64748B] mt-1">D/E ratio at {formatRatio(creditRisk.debtToEquity)} against industry threshold of 2.0x.</p>
            </div>

            <div className="p-3 rounded-md bg-white border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Debt service capacity</span>
              <span className="text-sm font-semibold text-[#172033] mt-1 block">{creditRisk.summary.debtBurden}</span>
              <p className="text-[11px] text-[#64748B] mt-1">Coverage of {formatRatio(creditRisk.interestCoverage)}x provides solvency cushion.</p>
            </div>

            <div className="p-3 rounded-md bg-white border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Credit facility draw rate</span>
              <span className="text-sm font-semibold text-[#172033] mt-1 block">{formatPct(creditRisk.creditUtilization)}</span>
              <p className="text-[11px] text-[#64748B] mt-1">Conservative utilization of approved liquidity lines.</p>
            </div>
          </div>

          {/* Key Strengths & Sensitivities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-[#16805B]/5 border border-[#16805B]/20 space-y-2">
              <span className="text-[11px] font-semibold text-[#16805B] block">Credit strengths</span>
              <ul className="space-y-1.5 list-disc list-inside text-[#172033]">
                {executiveSummary.aiExplanation.positiveIndicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-md bg-[#C53D3D]/5 border border-[#C53D3D]/20 space-y-2">
              <span className="text-[11px] font-semibold text-[#C53D3D] block">Risk sensitivities & covenants</span>
              <ul className="space-y-1.5 list-disc list-inside text-[#172033]">
                {executiveSummary.aiExplanation.negativeIndicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <AIInsight title="Underwriting rationale & recommendation" text={executiveSummary.aiExplanation.businessSummary} />
        </CardContent>
      </Card>
    </div>
  );
};


