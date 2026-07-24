// src/modules/financial-analytics/services/LiquidityService.ts
import { USE_MOCK } from "../constants";
import { liquidityMockData } from "../mock/liquidity.mock";
import type { LiquidityInput } from "../types";

export const fetchLiquidityData = async (): Promise<LiquidityInput> => {
  if (USE_MOCK) {
    // Simulate latency
    await new Promise((res) => setTimeout(res, 500));
    return liquidityMockData as LiquidityInput;
  }
  // Placeholder for future FastAPI call
  // Example: return fetch("/api/v1/liquidity").then(res => res.json());
  throw new Error("Real API not implemented");
};
