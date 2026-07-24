// src/modules/financial-analytics/services/TreasuryService.ts
import { USE_MOCK } from "../constants";
import { treasuryMockData } from "../mock/treasury.mock";
import type { TreasuryInput } from "../types";

export const fetchTreasuryData = async (): Promise<TreasuryInput> => {
  if (USE_MOCK) {
    // Simulate latency
    await new Promise((res) => setTimeout(res, 500));
    return treasuryMockData as TreasuryInput;
  }
  // Placeholder for future FastAPI call
  // Example: return fetch("/api/v1/treasury").then(res => res.json());
  throw new Error("Real API not implemented");
};
