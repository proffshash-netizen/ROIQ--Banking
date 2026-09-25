// Dashboard service placeholder
// This file defines functions to interact with the backend for dashboard data.
// Currently it returns mock data matching the DashboardState interface.

import type { DashboardState } from '@/stores/dashboardStore';
import { api } from '@/lib/api';

/**
 * Fetch dashboard KPI data from the FastAPI backend.
 */
export async function fetchDashboardKPIs(): Promise<Partial<DashboardState>> {
  try {
    const res = await api.get('/dashboard/kpis');
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
  } catch (error) {
    // Return fallback if backend is momentarily unreachable
  }
  return {
    companiesEvaluated: 16,
    totalLoanValue: Number(import.meta.env.VITE_TOTAL_LOAN_VALUE ?? 0),
    highRiskFlags: 2,
    reportsGenerated: 14,
    datasetsUploaded: 1,
    loanApprovals: 12,
    loanRejections: 3,
    executiveReports: 14,
    analysisCompleted: 16,
    backendStatus: 'operational',
  };
}

export async function fetchDashboardOverview(): Promise<any> {
  try {
    const res = await api.get('/dashboard/overview');
    return res.data;
  } catch (error) {
    return null;
  }
}
