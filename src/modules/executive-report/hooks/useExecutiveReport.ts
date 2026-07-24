// Executive Report Hook
import { useState, useEffect, useCallback } from "react";
import { executiveReportService } from "../services/executiveReport.service";
import type { ExecutiveReportVM } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export function useExecutiveReport() {
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);
  const [data, setData] = useState<ExecutiveReportVM | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await executiveReportService.getExecutiveReport();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load executive report data.");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchReport();
  }, [fetchReport, selectedCompanyId]);

  const downloadPDF = useCallback(() => {
    executiveReportService.exportPDF();
  }, []);

  const printPDF = useCallback(() => {
    executiveReportService.printPDF();
  }, []);

  return {
    data,
    loading,
    error,
    retry: fetchReport,
    downloadPDF,
    printPDF,
  };
}
