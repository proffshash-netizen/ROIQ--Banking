// Credit Risk Module – FastAPI-backed Service with offline fallback
import { api } from "@/lib/api";
import { getCreditRiskMockData } from "../mock/creditRisk.mock";
import { getMarketRiskMockData } from "../mock/marketRisk.mock";
import type { MarketRiskInput, CreditRiskInput } from "../types";

export interface CreditRiskServiceResponse {
  marketRisk: MarketRiskInput;
  creditRisk: CreditRiskInput;
}

export interface CreditRiskAnalysisResult {
  company_id: string;
  company_name: string;
  credit_score: number;
  risk_category: string;
  credit_rating: string;
  probability_of_default: number;
  metrics: Record<string, unknown>;
  risk_factors: string[];
  positive_factors: string[];
  ai_insights: string[];
  recommendation?: {
    decision: string;
    requested_amount: number;
    approved_amount: number;
    pricing_spread: string;
    covenants: string[];
    tenure_months: number;
  };
  human_review_required: boolean;
  human_approval?: {
    approved: boolean;
    notes: string;
    adjusted_category?: string;
    officer?: string;
    timestamp?: string;
  };
  workflow_status: string;
  current_node: string;
  thread_id: string;
  chart_data?: Record<string, unknown>;
  is_llm_generated?: boolean;
}

export const fetchCreditRiskData = async (companyId?: string | number): Promise<CreditRiskServiceResponse> => {
  try {
    const res = await api.get(`/credit-risk/${companyId ?? 1}`);
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
  } catch {
    // Graceful fallback if backend is momentarily unreachable
  }
  return {
    marketRisk: getMarketRiskMockData(),
    creditRisk: getCreditRiskMockData(),
  };
};

export const triggerCreditRiskAnalysis = async (
  companyId: string | number,
  payload?: { requested_loan?: number; tenure_months?: number }
): Promise<CreditRiskAnalysisResult> => {
  const res = await api.post(`/credit-risk/${companyId}/analyze`, payload ?? {});
  if (res.data?.success && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.data?.error?.message || "Failed to execute credit risk analysis");
};

export const submitHumanReviewDecision = async (
  companyId: string | number,
  review: {
    approved: boolean;
    notes: string;
    adjusted_category?: string;
    officer?: string;
  }
): Promise<CreditRiskAnalysisResult> => {
  const res = await api.post(`/credit-risk/${companyId}/review`, review);
  if (res.data?.success && res.data?.data) {
    return res.data.data;
  }
  throw new Error(res.data?.error?.message || "Failed to submit human review");
};
