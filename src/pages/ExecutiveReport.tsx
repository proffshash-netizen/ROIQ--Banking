import {
  useExecutiveReport,
  ExecutiveReportHeaderWidget,
  ExecutiveReportPreviewWidget,
  ReportLoadingSkeleton,
} from "@/modules/executive-report";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ExecutiveReport() {
  const { data, loading, error, retry, downloadPDF, printPDF } = useExecutiveReport();

  if (loading) {
    return <ReportLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Error Loading Executive Report</h3>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs">{error || "No report data available."}</span>
            <Button variant="outline" size="sm" onClick={retry} className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header & Export Toolbar */}
      <ExecutiveReportHeaderWidget
        reportId={data.reportId}
        generationDate={data.executiveSummary.reportGenerationDate}
        onDownloadPDF={downloadPDF}
        onPrintPDF={printPDF}
        onRefresh={retry}
      />

      {/* Structured Executive Report Assessment Document Preview */}
      <ExecutiveReportPreviewWidget data={data} />
    </div>
  );
}

export default ExecutiveReport;

