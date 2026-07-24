// Loan Recommendation Custom Hook
// State management for loading, data fetching, and error states.

import { useState, useEffect, useCallback } from "react";
import { loanRecommendationService } from "../services/loanRecommendation.service";
import type { LoanRecommendationDataVM } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export function useLoanRecommendation() {
  const [data, setData] = useState<LoanRecommendationDataVM | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);

  const fetchRecommendation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loanRecommendationService.getLoanRecommendation();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load loan recommendation data.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  return {
    data,
    loading,
    error,
    retry: fetchRecommendation,
  };
}
