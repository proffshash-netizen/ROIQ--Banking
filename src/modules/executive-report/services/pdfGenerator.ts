// Executive Report – PDF Generator Utility
// Generates clean print/PDF export matching standard corporate credit committee formatting.

import html2pdf from 'html2pdf.js';

/**
 * Downloads the executive report as a PDF file.
 * The browser will save it to the user's Downloads folder.
 * Filename: ExecutiveReport_ROIQ_<timestamp>.pdf
 */
export function generateExecutiveReportPDF(): void {
  const element = document.getElementById('executive-report');
  if (!element) {
    console.error('Executive report element not found');
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `ExecutiveReport_ROIQ_${timestamp}.pdf`;

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, logging: false, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  html2pdf().set(opt).from(element).save();
}

/**
 * Opens the browser's native print dialog for the executive report.
 */
export function printExecutiveReport(): void {
  window.print();
}
