// Executive Report Header & Toolbar Widget
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Printer, FileText } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#E2E8F0] rounded-lg p-5 print:hidden">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#2457D6]" />
          <span className="text-xs font-semibold text-[#64748B]">
            Credit assessment dossier · {reportId}
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#172033] mt-1">
          Executive Credit Assessment Report
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Generated on {generationDate} · ROIQ Corporate Credit Platform
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2 text-xs border-[#E2E8F0] text-[#172033] rounded">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onPrintPDF} className="gap-2 text-xs border-[#E2E8F0] text-[#172033] rounded">
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
        <Button size="sm" onClick={onDownloadPDF} className="gap-2 text-xs bg-[#2457D6] hover:bg-[#1f4bb8] text-white rounded">
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

