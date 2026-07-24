// Loan Recommendation Service — company-aware

import { getLoanRecommendationMockData } from "../mock/loanRecommendation.mock";
import { transformLoanRecommendationInput } from "../transformers";
import type { LoanRecommendationDataVM } from "../types";

export const loanRecommendationService = {
  async getLoanRecommendation(): Promise<LoanRecommendationDataVM> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return transformLoanRecommendationInput(getLoanRecommendationMockData());
  },
};
