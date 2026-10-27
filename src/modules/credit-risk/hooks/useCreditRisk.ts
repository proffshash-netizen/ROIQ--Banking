// Credit Risk Module – React Hook
// Fetches data via service, transforms through the transformation layer, and returns view models.

import { useState, useEffect, useCallback } from "react";
import {
  fetchCreditRiskData,
  triggerCreditRiskAnalysis,
  submitHumanReviewDecision,
  type CreditRiskAnalysisResult,
} from "../services/creditRisk.service";
import { transformMarketRisk, transformCreditRisk, transformExecutiveSummary } from "../transformers";
import type { MarketRiskVM, CreditRiskVM, ExecutiveSummaryVM } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export interface UseCreditRiskResult {
  marketRisk: MarketRiskVM | null;
  creditRisk: CreditRiskVM | null;
  executiveSummary: ExecutiveSummaryVM | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  analysisResult: CreditRiskAnalysisResult | null;
  analyzeRisk: (payload?: { requested_loan?: number; tenure_months?: number }) => Promise<CreditRiskAnalysisResult | void>;
  submitReview: (review: { approved: boolean; notes: string; adjusted_category?: string; officer?: string }) => Promise<CreditRiskAnalysisResult | void>;
  retry: () => void;
}

export const useCreditRisk = (): UseCreditRiskResult => {
  const [marketRisk, setMarketRisk] = useState<MarketRiskVM | null>(null);
  const [creditRisk, setCreditRisk] = useState<CreditRiskVM | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummaryVM | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CreditRiskAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await fetchCreditRiskData(selectedCompanyId);

      const marketVM = transformMarketRisk(raw.marketRisk);
      const creditVM = transformCreditRisk(raw.creditRisk);
      const execVM = transformExecutiveSummary(marketVM, creditVM);

      setMarketRisk(marketVM);
      setCreditRisk(creditVM);
      setExecutiveSummary(execVM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credit risk data");
    } finally {
      setLoading(false);
    }
  }, [selectedCompanyId]);

  const analyzeRisk = useCallback(
    async (payload?: { requested_loan?: number; tenure_months?: number }) => {
      try {
        setAnalyzing(true);
        setError(null);
        const res = await triggerCreditRiskAnalysis(selectedCompanyId, payload);
        setAnalysisResult(res);
        // Refresh base data as well
        await load();
        return res;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setAnalyzing(false);
      }
    },
    [selectedCompanyId, load]
  );

  const submitReview = useCallback(
    async (review: { approved: boolean; notes: string; adjusted_category?: string; officer?: string }) => {
      try {
        setAnalyzing(true);
        setError(null);
        const res = await submitHumanReviewDecision(selectedCompanyId, review);
        setAnalysisResult(res);
        await load();
        return res;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Review submission failed");
      } finally {
        setAnalyzing(false);
      }
    },
    [selectedCompanyId, load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    marketRisk,
    creditRisk,
    executiveSummary,
    loading,
    analyzing,
    error,
    analysisResult,
    analyzeRisk,
    submitReview,
    retry: load,
  };
};
