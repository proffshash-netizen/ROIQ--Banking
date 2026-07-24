// Executive Report Service
import { getTransformedExecutiveReport } from "../transformers";
import { generateExecutiveReportPDF, printExecutiveReport } from "./pdfGenerator";
import type { ExecutiveReportVM } from "../types";

export const executiveReportService = {
  async getExecutiveReport(): Promise<ExecutiveReportVM> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return getTransformedExecutiveReport();
  },

  exportPDF(): void {
    generateExecutiveReportPDF();
  },

  printPDF(): void {
    printExecutiveReport();
  },
};
