// Dashboard service placeholder
// This file defines functions to interact with the backend for dashboard data.
// Currently it returns mock data matching the DashboardState interface.

import type { DashboardState } from '@/stores/dashboardStore';

/**
 * Simulate fetching dashboard KPI data from the FastAPI backend.
 * Returns a promise that resolves to the initial KPI values.
 */
export function fetchDashboardKPIs(): Promise<DashboardState> {
  // Placeholder implementation – replace with real API call.
  const mockData: DashboardState = {
    companiesEvaluated: 16,
    totalLoanValue: Number(import.meta.env.VITE_TOTAL_LOAN_VALUE ?? 0),
    highRiskFlags: 2,
    reportsGenerated: 14,
    datasetsUploaded: 0,
    loanApprovals: 0,
    loanRejections: 0,
    executiveReports: 0,
    analysisCompleted: 0,
    backendStatus: 'waiting',
    updateKPIs: () => {}
  };
  return Promise.resolve(mockData);
}
