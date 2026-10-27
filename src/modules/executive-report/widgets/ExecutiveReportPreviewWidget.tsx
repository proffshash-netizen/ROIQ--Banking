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
        return "bg-[#16805B]/10 text-[#16805B] border-[#16805B]/30 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300";
      case "APPROVE WITH CONDITIONS":
        return "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30 print:bg-amber-50 print:text-amber-900 print:border-amber-300";
      case "FURTHER REVIEW":
        return "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30 print:bg-amber-50 print:text-amber-900 print:border-amber-300";
      case "REJECT":
        return "bg-[#C53D3D]/10 text-[#C53D3D] border-[#C53D3D]/30 print:bg-red-50 print:text-red-900 print:border-red-300";
    }
  };

  const getDecisionIcon = (decision: DecisionOutcome) => {
    switch (decision) {
      case "APPROVE":
        return <CheckCircle2 className="h-6 w-6 text-[#16805B] print:text-emerald-700 shrink-0" />;
      case "APPROVE WITH CONDITIONS":
        return <AlertTriangle className="h-6 w-6 text-[#B7791F] print:text-amber-700 shrink-0" />;
      case "FURTHER REVIEW":
        return <HelpCircle className="h-6 w-6 text-[#B7791F] print:text-amber-700 shrink-0" />;
      case "REJECT":
        return <XCircle className="h-6 w-6 text-[#C53D3D] print:text-red-700 shrink-0" />;
    }
  };

  return (
    <div id="executive-report" className="bg-white border border-[#E2E8F0] rounded-lg p-8 shadow-xs space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
      {/* Cover Header / Institutional Branding */}
      <div className="border-b border-[#E2E8F0] pb-6 flex items-center justify-between print:border-zinc-300">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#2457D6] print:text-zinc-800" />
            <span className="text-xs font-semibold text-[#64748B] print:text-zinc-700">
              ROIQ Corporate Credit Platform · Confidential Underwriting Dossier
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] print:text-zinc-900 mt-1.5">
            Credit Assessment Executive Report
          </h1>
          <p className="text-xs text-[#64748B] print:text-zinc-600 mt-0.5">
            Credit committee document · Report reference: {data.reportId}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-[#172033] print:text-zinc-900 block">
            Generated: {data.executiveSummary.reportGenerationDate}
          </span>
          <span className="text-xs text-[#64748B] print:text-zinc-500">Version 1.0 (Final)</span>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172033] print:text-zinc-900 border-l-[3px] border-[#2457D6] pl-2.5">
          <FileText className="h-4 w-4 text-[#2457D6] print:text-zinc-800" />
          <span>1. Executive summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 print:bg-zinc-50 print:border-zinc-300">
          <div>
            <span className="text-xs text-[#64748B] print:text-zinc-600 font-medium block">Applicant company</span>
            <span className="text-sm font-semibold text-[#172033] print:text-zinc-900">{data.executiveSummary.companyName}</span>
          </div>
          <div>
            <span className="text-xs text-[#64748B] print:text-zinc-600 font-medium block">Industry sector</span>
            <span className="text-sm font-semibold text-[#172033] print:text-zinc-900">{data.executiveSummary.industry}</span>
          </div>
          <div>
            <span className="text-xs text-[#64748B] print:text-zinc-600 font-medium block">Requested loan amount</span>
            <span className="text-sm font-semibold text-[#16805B] print:text-emerald-700">{data.executiveSummary.requestedLoanAmount}</span>
          </div>
          <div>
            <span className="text-xs text-[#64748B] print:text-zinc-600 font-medium block">Tenure / Facility</span>
            <span className="text-sm font-semibold text-[#172033] print:text-zinc-900">{data.executiveSummary.loanTenure}</span>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 text-xs text-[#64748B] print:bg-zinc-50 print:border-zinc-300 print:text-zinc-800">
          <strong className="text-[#172033] print:text-zinc-900">Loan purpose:</strong> {data.executiveSummary.loanPurpose}
        </div>
      </section>

      {/* SECTION 2: KEY FINANCIAL HIGHLIGHTS */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172033] print:text-zinc-900 border-l-[3px] border-[#2457D6] pl-2.5">
          <TrendingUp className="h-4 w-4 text-[#2457D6] print:text-zinc-800" />
          <span>2. Key financial highlights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Liquidity position</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.liquidityPosition}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Treasury health</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.treasuryHealth}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Revenue trend</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.revenueTrend}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Profitability</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.profitability}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Cash flow generation</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.cashFlow}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="font-semibold text-[#172033] print:text-zinc-900 block">Debt position</span>
            <span className="text-[#64748B] print:text-zinc-700 mt-1 block">{data.keyFinancialHighlights.debtPosition}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#16805B]/5 border border-[#16805B]/20 p-3 rounded-lg space-y-1 print:bg-emerald-50 print:border-emerald-200">
            <span className="font-semibold text-[#16805B] block">Financial strengths</span>
            <ul className="list-disc list-inside text-[#172033] print:text-zinc-700 space-y-0.5">
              {data.keyFinancialHighlights.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#C53D3D]/5 border border-[#C53D3D]/20 p-3 rounded-lg space-y-1 print:bg-red-50 print:border-red-200">
            <span className="font-semibold text-[#C53D3D] block">Financial vulnerabilities</span>
            <ul className="list-disc list-inside text-[#172033] print:text-zinc-700 space-y-0.5">
              {data.keyFinancialHighlights.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: MARKET & FX RISK SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172033] print:text-zinc-900 border-l-[3px] border-[#2457D6] pl-2.5">
          <BarChart2 className="h-4 w-4 text-[#2457D6] print:text-zinc-800" />
          <span>3. Market & FX risk summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Value at Risk (95% 1-Day)</span>
            <span className="font-semibold text-[#172033] print:text-zinc-900 mt-0.5 block">{data.marketFXRiskSummary.var95}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Expected shortfall</span>
            <span className="font-semibold text-[#172033] print:text-zinc-900 mt-0.5 block">{data.marketFXRiskSummary.expectedShortfall}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Contract exposure</span>
            <span className="font-semibold text-[#172033] print:text-zinc-900 mt-0.5 block">{data.marketFXRiskSummary.fxExposure}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Hedged ratio</span>
            <span className="font-semibold text-[#172033] print:text-zinc-900 mt-0.5 block">{data.marketFXRiskSummary.hedgedVsUnhedged}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Tail risk ratio</span>
            <span className="font-semibold text-[#172033] print:text-zinc-900 mt-0.5 block">{data.marketFXRiskSummary.tailRisk}</span>
          </div>
        </div>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg text-xs text-[#64748B] print:bg-zinc-50 print:border-zinc-300 print:text-zinc-800">
          <strong className="text-[#172033] print:text-zinc-900">Market risk conclusion:</strong> {data.marketFXRiskSummary.overallMarketRiskConclusion}
        </div>
      </section>

      {/* SECTION 4: CREDIT RISK SUMMARY */}
      <section className="space-y-3 break-inside-avoid">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172033] print:text-zinc-900 border-l-[3px] border-[#2457D6] pl-2.5">
          <ShieldCheck className="h-4 w-4 text-[#2457D6] print:text-zinc-800" />
          <span>4. Credit risk summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Credit rating</span>
            <span className="font-semibold text-sm text-[#172033] print:text-zinc-900 mt-0.5 block">{data.creditRiskSummary.creditRating}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Total debt</span>
            <span className="font-semibold text-sm text-[#172033] print:text-zinc-900 mt-0.5 block">{data.creditRiskSummary.existingDebt}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Repayment behavior</span>
            <span className="font-semibold text-sm text-[#172033] print:text-zinc-900 mt-0.5 block">{data.creditRiskSummary.repaymentBehaviour}</span>
          </div>
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-lg print:border-zinc-300 print:bg-zinc-50">
            <span className="text-[#64748B] print:text-zinc-600 block text-[11px]">Default history</span>
            <span className="font-semibold text-sm text-[#172033] print:text-zinc-900 mt-0.5 block">{data.creditRiskSummary.defaultHistory}</span>
          </div>
        </div>

        {/* Structured Table for Credit Debt Ratios */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg print:border-zinc-300">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] print:bg-zinc-100 text-[#64748B] print:text-zinc-700 font-semibold border-b border-[#E2E8F0] print:border-zinc-300">
                <th className="py-2.5 px-3">Credit benchmark metric</th>
                <th className="py-2.5 px-3 text-right">Evaluated value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] print:divide-zinc-200">
              {data.creditRiskSummary.debtRatios.map((ratio, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] print:bg-white">
                  <td className="py-2 px-3 font-medium text-[#172033] print:text-zinc-900">{ratio.name}</td>
                  <td className="py-2 px-3 font-semibold text-right font-mono text-[#172033] print:text-zinc-900">{ratio.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: RISK AGGREGATION & LOAN RECOMMENDATION */}
      <section className="space-y-3 break-inside-avoid page-break-before">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172033] print:text-zinc-900 border-l-[3px] border-[#2457D6] pl-2.5">
          <Award className="h-4 w-4 text-[#2457D6] print:text-zinc-800" />
          <span>5. Risk aggregation & credit recommendation</span>
        </div>
        <div className={`rounded-lg border p-5 flex flex-col md:flex-row items-center justify-between gap-4 ${getDecisionVariant(data.riskAggregation.recommendedDecision)}`}>
          <div className="flex items-center gap-3">
            {getDecisionIcon(data.riskAggregation.recommendedDecision)}
            <div>
              <span className="text-[11px] font-semibold block opacity-80">
                Recommended outcome
              </span>
              <span className="text-lg font-bold tracking-tight">{data.riskAggregation.recommendedDecision}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-current/20 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs block opacity-80">Aggregated score</span>
              <span className="text-xl font-bold text-[#172033] print:text-zinc-900">{data.riskAggregation.overallRiskScore} / 100</span>
            </div>
            <div>
              <span className="text-xs block opacity-80">Risk classification</span>
              <span className="text-sm font-semibold text-[#172033] print:text-zinc-900">{data.riskAggregation.overallRiskLevel} Risk</span>
            </div>
            <div>
              <span className="text-xs block opacity-80">Model confidence</span>
              <span className="text-xl font-bold text-[#16805B] print:text-emerald-700">{data.riskAggregation.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DISCLAIMER */}
      <section className="pt-4 border-t border-[#E2E8F0] space-y-2 break-inside-avoid print:border-zinc-300">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] print:text-zinc-600">
          <Info className="h-3.5 w-3.5 text-[#64748B] print:text-zinc-600" />
          <span>6. Regulatory & institutional disclaimer</span>
        </div>
        <p className="text-xs text-[#64748B] print:text-zinc-600 leading-relaxed">
          {data.disclaimer}
        </p>
      </section>
    </div>
  );
};

