// src/modules/financial-analytics/store/financialAnalyticsStore.ts
import { create } from 'zustand';
import type { TreasuryInput, LiquidityInput } from '../types';
import { fetchFinancialAnalyticsData } from '../services/FinancialAnalyticsMockService';

interface FinancialAnalyticsState {
  treasury: TreasuryInput | null;
  liquidity: LiquidityInput | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useFinancialAnalyticsStore = create<FinancialAnalyticsState>((set) => ({
  treasury: null,
  liquidity: null,
  loading: false,
  error: null,
  lastUpdated: null,
  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const { treasury, liquidity } = await fetchFinancialAnalyticsData();
      set({ treasury, liquidity, loading: false, lastUpdated: new Date() });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('FinancialAnalytics fetch error:', e);
      set({ error: message, loading: false });
    }
  },
  reset: () => set({ treasury: null, liquidity: null, loading: false, error: null, lastUpdated: null }),
}));
