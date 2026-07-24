// Credit Risk Module – React Hook
// Fetches data via service, transforms through the transformation layer, and returns view models.

import { useState, useEffect, useCallback } from "react";
import { fetchCreditRiskData } from "../services/creditRisk.service";
import { transformMarketRisk, transformCreditRisk, transformExecutiveSummary } from "../transformers";
import type { MarketRiskVM, CreditRiskVM, ExecutiveSummaryVM } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export interface UseCreditRiskResult {
  marketRisk: MarketRiskVM | null;
  creditRisk: CreditRiskVM | null;
  executiveSummary: ExecutiveSummaryVM | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export const useCreditRisk = (): UseCreditRiskResult => {
  const [marketRisk, setMarketRisk] = useState<MarketRiskVM | null>(null);
  const [creditRisk, setCreditRisk] = useState<CreditRiskVM | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummaryVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await fetchCreditRiskData();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  useEffect(() => {
    load();
  }, [load]);

  return { marketRisk, creditRisk, executiveSummary, loading, error, retry: load };
};
