// Executive Report Service — FastAPI backend connected with offline fallback
import { api } from "@/lib/api";
import { getTransformedExecutiveReport } from "../transformers";
import { generateExecutiveReportPDF, printExecutiveReport } from "./pdfGenerator";
import type { ExecutiveReportVM } from "../types";

export const executiveReportService = {
  async getExecutiveReport(companyId?: string | number): Promise<ExecutiveReportVM> {
    try {
      const res = await api.get(`/executive-report/${companyId ?? 1}`);
      if (res.data?.success && res.data?.data) {
        return res.data.data as ExecutiveReportVM;
      }
    } catch {
      // Graceful fallback for offline demo mode
    }
    return getTransformedExecutiveReport();
  },

  exportPDF(): void {
    generateExecutiveReportPDF();
  },

  printPDF(): void {
    printExecutiveReport();
  },
};
