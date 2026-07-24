import { create } from 'zustand'

const ENV_TOTAL_LOAN_VALUE = Number(import.meta.env.VITE_TOTAL_LOAN_VALUE ?? 0)

export interface DashboardState {
  companiesEvaluated: number
  totalLoanValue: number
  highRiskFlags: number
  reportsGenerated: number
  datasetsUploaded: number
  loanApprovals: number
  loanRejections: number
  executiveReports: number
  analysisCompleted: number
  backendStatus: string
  // Action to update KPIs from API response later
  updateKPIs: (kpis: Partial<Omit<DashboardState, 'updateKPIs'>>) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  companiesEvaluated: 16,
  totalLoanValue: ENV_TOTAL_LOAN_VALUE,
  highRiskFlags: 2,
  reportsGenerated: 14,
  datasetsUploaded: 0,
  loanApprovals: 0,
  loanRejections: 0,
  executiveReports: 0,
  analysisCompleted: 0,
  backendStatus: "waiting",
  updateKPIs: (kpis) => set((state) => ({ ...state, ...kpis })),
}))
