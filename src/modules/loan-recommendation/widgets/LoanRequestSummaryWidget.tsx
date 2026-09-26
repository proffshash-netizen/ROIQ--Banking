// Section 1: Loan Request Summary Widget
// Structured information cards displaying company name, loan amount, purpose, tenure, product, requested date.

import React from "react";
import type { LoanSummaryVM } from "../types";
import { SectionHeader, AISummaryCard } from "./shared";
import { Building2, DollarSign, Calendar, FileText, Clock, Tag } from "lucide-react";

interface LoanRequestSummaryWidgetProps {
  data: LoanSummaryVM;
}

export const LoanRequestSummaryWidget: React.FC<LoanRequestSummaryWidgetProps> = ({ data }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader
        title="SECTION 1: LOAN REQUEST SUMMARY"
        subtitle="Applicant credit facility metadata and request parameters"
        badgeText="Module Input"
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Company Name */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Building2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium">Company Name</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground truncate" title={data.companyName}>
              {data.companyName}
            </div>
            <span className="text-[10px] text-muted-foreground">Corporate Applicant</span>
          </div>
        </div>

        {/* Card 2: Requested Loan Amount */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium">Requested Amount</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-400">{data.formattedLoanAmount}</div>
            <span className="text-[10px] text-muted-foreground">Currency: {data.currency}</span>
          </div>
        </div>

        {/* Card 3: Loan Purpose */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileText className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium">Loan Purpose</span>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground line-clamp-2" title={data.loanPurpose}>
              {data.loanPurpose}
            </div>
            <span className="text-[10px] text-muted-foreground">Primary Use of Proceeds</span>
          </div>
        </div>

        {/* Card 4: Loan Tenure */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium">Loan Tenure</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{data.formattedTenure}</div>
            <span className="text-[10px] text-muted-foreground">{data.loanTenureMonths} Monthly Amortizations</span>
          </div>
        </div>

        {/* Card 5: Requested Product Type */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium">Product Type</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground truncate" title={data.requestedProductType}>
              {data.requestedProductType}
            </div>
            <span className="text-[10px] text-muted-foreground">Credit Instrument</span>
          </div>
        </div>

        {/* Card 6: Requested Date */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium">Requested Date</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{data.requestedDate}</div>
            <span className="text-[10px] text-muted-foreground">Submission Date</span>
          </div>
        </div>
      </div>

      <AISummaryCard text={data.aiSummary} title="AI Summary – Application Overview" />
    </div>
  );
};
