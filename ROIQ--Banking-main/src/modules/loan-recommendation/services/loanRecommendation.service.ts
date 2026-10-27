// Loan Recommendation Service — connects to FastAPI backend with offline fallback
import { api } from "@/lib/api";
import { getLoanRecommendationMockData } from "../mock/loanRecommendation.mock";
import { transformLoanRecommendationInput } from "../transformers";
import type { LoanRecommendationDataVM, LoanRecommendationInput } from "../types";

export const loanRecommendationService = {
  async getLoanRecommendation(companyId?: string | number): Promise<LoanRecommendationDataVM> {
    try {
      const res = await api.get(`/loan-recommendation/${companyId ?? 1}`);
      if (res.data?.success && res.data?.data) {
        return transformLoanRecommendationInput(res.data.data as LoanRecommendationInput);
      }
    } catch {
      // Graceful fallback for offline demo mode
    }
    return transformLoanRecommendationInput(getLoanRecommendationMockData());
  },
};
