// src/modules/financial-analytics/hooks/useFinancialAnalytics.ts
import { useEffect } from 'react';
import { useFinancialAnalyticsStore } from '../store/financialAnalyticsStore';
import { useCompaniesStore } from '@/stores/companiesStore';

export const useFinancialAnalytics = () => {
  const { treasury, liquidity, loading, error, refresh, reset } = useFinancialAnalyticsStore();
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);

  useEffect(() => {
    refresh(selectedCompanyId);
  }, [selectedCompanyId, refresh]);

  const retry = () => refresh(selectedCompanyId);

  return { treasury, liquidity, loading, error, retry, reset };
};
