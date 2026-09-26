// Executive Report Preview Widget
// Executive Credit Assessment Report with structured multi-page section breaks, clean tables, and print optimization.

import React from "react";
import type { ExecutiveReportVM, DecisionOutcome } from "../types";
import {
  FileText,
  Building2,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Info,
} from "lucide-react";

interface ExecutiveReportPreviewWidgetProps {
  data: ExecutiveReportVM;
}

export const ExecutiveReportPreviewWidget: React.FC<ExecutiveReportPreviewWidgetProps> = ({ data }) => {
  const getDecisionVariant = (decision: DecisionOutcome) => {
    switch (decision) {
      case "APPROVE":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300";
      case "APPROVE WITH CONDITIONS":
        return "bg-purple-500/15 text-purple-400 border-purple-500/40 print:bg-purple-50 print:text-purple-900 print:border-purple-300";
      case "FURTHER REVIEW":
        return "bg-purple-500/15 text-purple-400 border-purple-500/40 print:bg-purple-50 print:text-purple-900 print:border-purple-300";
      case "REJECT":
        return "bg-red-500/15 text-red-400 border-red-500/40 print:bg-red-50 print:text-red-900 print:border-red-300";
    }
  };

  const getDecisionIcon = (decision: DecisionOutcome) => {
    switch (decision) {
      case "APPROVE":
        return <CheckCircle2 className="h-7 w-7 text-emerald-400 print:text-emerald-700 shrink-0" />;
      case "APPROVE WITH CONDITIONS":
        return <AlertTriangle className="h-7 w-7 text-purple-400 print:text-purple-700 shrink-0" />;
      case "FURTHER REVIEW":
        return <HelpCircle className="h-7 w-7 text-purple-400 print:text-purple-700 shrink-0" />;
      case "REJECT":
        return <XCircle className="h-7 w-7 text-red-400 print:text-red-700 shrink-0" />;
    }
  };

  return (
    <div id="executive-report" className="bg-card border border-border rounded-xl p-8 shadow-md space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
      {/* Cover Header / Institutional Branding */}
      <div className="border-b border-border/80 pb-6 flex items-center justify-between print:border-zinc-300">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary print:text-zinc-800" />
            <span className="text-base font-extrabold tracking-tight text-foreground print:text-zinc-900 uppercase">
              ROIQ AI • Credit Risk Analytics Suite
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground print:text-zinc-900 mt-2">
            CREDIT ASSESSMENT EXECUTIVE REPORT
          </h1>
          <p className="text-sm text-muted-foreground print:text-zinc-600 mt-1">
            Confidential Credit Committee Document • Report Ref: {data.reportId}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-muted-foreground print:text-zinc-600 block">
            Generated: {data.executiveSummary.reportGenerationDate}
          </span>
          <span className="text-xs text-muted-foreground print:text-zinc-500">Version 1.0 (Final)</span>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-base font-bold text-foreground print:text-zinc-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">
          <FileText className="h-5 w-5 text-primary print:text-zinc-800" />
          <span>1. Executive Summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/20 border border-border/60 rounded-lg p-4 print:bg-zinc-50 print:border-zinc-300">
          <div>
            <span className="text-xs text-muted-foreground print:text-zinc-600 font-medium block">Applicant Company</span>
            <span className="text-base font-bold text-foreground print:text-zinc-900">{data.executiveSummary.companyName}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground print:text-zinc-600 font-medium block">Industry Sector</span>
            <span className="text-base font-bold text-foreground print:text-zinc-900">{data.executiveSummary.industry}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground print:text-zinc-600 font-medium block">Requested Loan Amount</span>
            <span className="text-base font-bold text-emerald-400 print:text-emerald-700">{data.executiveSummary.requestedLoanAmount}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground print:text-zinc-600 font-medium block">Tenure / Facility</span>
            <span className="text-base font-bold text-foreground print:text-zinc-900">{data.executiveSummary.loanTenure}</span>
          </div>
        </div>
        <div className="bg-muted/10 border border-border/40 rounded-lg p-3 text-sm text-muted-foreground print:bg-zinc-50 print:border-zinc-300 print:text-zinc-800">
          <strong className="text-foreground print:text-zinc-900">Loan Purpose:</strong> {data.executiveSummary.loanPurpose}
        </div>
      </section>

      {/* SECTION 2: KEY FINANCIAL HIGHLIGHTS */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-base font-bold text-foreground print:text-zinc-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">
          <TrendingUp className="h-5 w-5 text-primary print:text-zinc-800" />
          <span>2. Key Financial Highlights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Liquidity Position</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.liquidityPosition}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Treasury Health</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.treasuryHealth}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Revenue Trend</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.revenueTrend}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Profitability</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.profitability}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Cash Flow Generation</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.cashFlow}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-foreground print:text-zinc-900 block">Debt Position</span>
            <span className="text-muted-foreground print:text-zinc-700">{data.keyFinancialHighlights.debtPosition}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg space-y-1 print:bg-emerald-50 print:border-emerald-200">
            <span className="font-bold text-emerald-400 print:text-emerald-800 block">Financial Strengths</span>
            <ul className="list-disc list-inside text-muted-foreground print:text-zinc-700 space-y-0.5">
              {data.keyFinancialHighlights.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg space-y-1 print:bg-red-50 print:border-red-200">
            <span className="font-bold text-red-400 print:text-red-800 block">Financial Vulnerabilities</span>
            <ul className="list-disc list-inside text-muted-foreground print:text-zinc-700 space-y-0.5">
              {data.keyFinancialHighlights.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: MARKET & FX RISK SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-base font-bold text-foreground print:text-zinc-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">
          <BarChart2 className="h-5 w-5 text-primary print:text-zinc-800" />
          <span>3. Market & FX Risk Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
          <div className="border border-border/60 bg-muted/10 p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Value at Risk (95% 1-Day)</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.marketFXRiskSummary.var95}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Expected Shortfall</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.marketFXRiskSummary.expectedShortfall}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Contract Exposure</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.marketFXRiskSummary.fxExposure}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Hedged Ratio</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.marketFXRiskSummary.hedgedVsUnhedged}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Tail Risk Ratio</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.marketFXRiskSummary.tailRisk}</span>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg text-sm text-muted-foreground print:bg-purple-50 print:border-purple-200 print:text-zinc-800">
          <strong className="text-purple-400 print:text-purple-800">Market Risk Conclusion:</strong> {data.marketFXRiskSummary.overallMarketRiskConclusion}
        </div>
      </section>

      {/* SECTION 4: CREDIT RISK SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-base font-bold text-foreground print:text-zinc-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">
          <ShieldCheck className="h-5 w-5 text-primary print:text-zinc-800" />
          <span>4. Credit Risk Summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Credit Rating</span>
            <span className="font-bold text-base text-foreground print:text-zinc-900">{data.creditRiskSummary.creditRating}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Total Outstanding Debt</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.creditRiskSummary.existingDebt}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Repayment Behavior</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.creditRiskSummary.repaymentBehaviour}</span>
          </div>
          <div className="border border-border/60 bg-muted/10 p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-muted-foreground print:text-zinc-600 block text-xs">Default History</span>
            <span className="font-semibold text-foreground print:text-zinc-900">{data.creditRiskSummary.defaultHistory}</span>
          </div>
        </div>

        {/* Structured Table for Credit Debt Ratios */}
        <div className="overflow-x-auto border border-border/60 rounded-lg print:border-zinc-300">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/30 print:bg-zinc-100 text-muted-foreground print:text-zinc-700 font-semibold border-b border-border/50 print:border-zinc-300">
                <th className="py-2 px-3">Credit Benchmark Metric</th>
                <th className="py-2 px-3">Evaluated Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 print:divide-zinc-200">
              {data.creditRiskSummary.debtRatios.map((ratio, i) => (
                <tr key={i} className="hover:bg-muted/10 print:bg-white">
                  <td className="py-2 px-3 font-medium text-foreground print:text-zinc-900">{ratio.name}</td>
                  <td className="py-2 px-3 font-bold text-foreground print:text-zinc-900">{ratio.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: RISK AGGREGATION & LOAN RECOMMENDATION */}
      <section className="space-y-3 break-inside-avoid page-break-before">
        <div className="flex items-center gap-2 text-base font-bold text-foreground print:text-zinc-900 uppercase tracking-wider border-l-4 border-primary pl-2.5">
          <Award className="h-5 w-5 text-primary print:text-zinc-800" />
          <span>5. Risk Aggregation & Credit Recommendation</span>
        </div>
        <div className={`rounded-xl border p-5 flex flex-col md:flex-row items-center justify-between gap-4 ${getDecisionVariant(data.riskAggregation.recommendedDecision)}`}>
          <div className="flex items-center gap-3">
            {getDecisionIcon(data.riskAggregation.recommendedDecision)}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                Recommended Outcome
              </span>
              <span className="text-xl font-black tracking-wide">{data.riskAggregation.recommendedDecision}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-current/20 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs block opacity-75">Aggregated Score</span>
              <span className="text-2xl font-extrabold text-foreground print:text-zinc-900">{data.riskAggregation.overallRiskScore} / 100</span>
            </div>
            <div>
              <span className="text-xs block opacity-75">Risk Classification</span>
              <span className="text-base font-bold text-foreground print:text-zinc-900">{data.riskAggregation.overallRiskLevel} Risk</span>
            </div>
            <div>
              <span className="text-xs block opacity-75">Model Confidence</span>
              <span className="text-2xl font-extrabold text-emerald-400 print:text-emerald-700">{data.riskAggregation.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DISCLAIMER */}
      <section className="pt-4 border-t border-border/60 space-y-2 break-inside-avoid print:border-zinc-300">
        <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground print:text-zinc-600 uppercase tracking-wider">
          <Info className="h-4 w-4 text-muted-foreground print:text-zinc-600" />
          <span>6. Regulatory & Institutional Disclaimer</span>
        </div>
        <p className="text-sm text-muted-foreground print:text-zinc-600 leading-relaxed">
          {data.disclaimer}
        </p>
      </section>
    </div>
  );
};
