// src/modules/financial-analytics/hooks/useFinancialAnalytics.ts
import { useEffect } from 'react';
import { useFinancialAnalyticsStore } from '../store/financialAnalyticsStore';
import { useCompaniesStore } from '@/stores/companiesStore';

export const useFinancialAnalytics = () => {
  const { treasury, liquidity, loading, error, refresh, reset } = useFinancialAnalyticsStore();
  const selectedCompanyId = useCompaniesStore((state) => state.selectedCompanyId);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  const retry = () => refresh();

  return { treasury, liquidity, loading, error, retry, reset };
};
