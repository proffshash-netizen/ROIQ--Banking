// Credit Risk Module – Service — uses company-aware mock generators

import { getCreditRiskMockData } from "../mock/creditRisk.mock";
import { getMarketRiskMockData } from "../mock/marketRisk.mock";
import type { MarketRiskInput, CreditRiskInput } from "../types";

export interface CreditRiskServiceResponse {
  marketRisk: MarketRiskInput;
  creditRisk: CreditRiskInput;
}

export const fetchCreditRiskData = async (): Promise<CreditRiskServiceResponse> => {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 300));
  return {
    marketRisk: getMarketRiskMockData(),
    creditRisk: getCreditRiskMockData(),
  };
};
