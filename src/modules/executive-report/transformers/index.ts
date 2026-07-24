// Executive Report Module – Data Transformation Layer

import type { ExecutiveReportVM } from "../types";
import { getExecutiveReportMockData } from "../mock/executiveReport.mock";

export function transformExecutiveReportData(raw: ExecutiveReportVM): ExecutiveReportVM {
  // Pass-through transformer with fallback sanitization
  return {
    ...raw,
    keyInsights: raw.keyInsights || [],
    conditions: {
      ...raw.conditions,
      requiredCollateral: raw.conditions.requiredCollateral || [],
      additionalDocumentation: raw.conditions.additionalDocumentation || [],
      financialCovenants: raw.conditions.financialCovenants || [],
      monitoringRequirements: raw.conditions.monitoringRequirements || [],
      rejectionReasons: raw.conditions.rejectionReasons || [],
    },
  };
}

export function getTransformedExecutiveReport(): ExecutiveReportVM {
  return transformExecutiveReportData(getExecutiveReportMockData());
}
