// src/modules/financial-analytics/store/treasuryStore.ts
import { create } from 'zustand';
import type { TreasuryInput } from '../types';
import { fetchTreasuryData } from '../services/TreasuryService';

interface TreasuryState {
  data: TreasuryInput | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useTreasuryStore = create<TreasuryState>((set) => ({
  data: null,
  loading: false,
  error: null,
  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTreasuryData();
      set({ data, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('Treasury fetch error:', e);
      set({ error: message, loading: false });
    }
  },
  reset: () => set({ data: null, loading: false, error: null }),
}));
