// Executive Report Header & Toolbar Widget
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Printer } from "lucide-react";

interface ExecutiveReportHeaderWidgetProps {
  reportId: string;
  generationDate: string;
  onDownloadPDF: () => void;
  onPrintPDF: () => void;
  onRefresh: () => void;
}

export const ExecutiveReportHeaderWidget: React.FC<ExecutiveReportHeaderWidgetProps> = ({
  reportId,
  generationDate,
  onDownloadPDF,
  onPrintPDF,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border rounded-xl p-5 shadow-sm print:hidden">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Credit Assessment Document • {reportId}
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground mt-1">
          Executive Credit Assessment Report
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generated on {generationDate} • ROIQ AI Corporate Banking Suite
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onPrintPDF} className="gap-2 text-xs">
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
        <Button size="sm" onClick={onDownloadPDF} className="gap-2 text-xs bg-primary text-primary-foreground font-semibold shadow-sm">
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};
