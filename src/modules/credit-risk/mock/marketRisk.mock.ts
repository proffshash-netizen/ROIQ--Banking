// Credit Risk Module – Mock Data (Market Risk) — Company-Aware
import type { MarketRiskInput } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export const getMarketRiskMockData = (): MarketRiskInput => {
  const store = useCompaniesStore.getState();
  const active = store.companies.find(c => c.id === store.selectedCompanyId) ?? store.companies[0];
  const score = active.creditScore;

  // Parse loan exposure
  let exposureMillion = 420;
  const loanStr = active.loanExposure;
  if (loanStr.includes("B")) {
    exposureMillion = parseFloat(loanStr.replace(/[^0-9.]/g, "")) * 1000;
  } else if (loanStr.includes("M")) {
    exposureMillion = parseFloat(loanStr.replace(/[^0-9.]/g, ""));
  }

  const currencyExposure = Math.round(exposureMillion * 1_000_000 * 2.1);
  const hedgedPct = score >= 80 ? 0.78 : score >= 65 ? 0.62 : score >= 50 ? 0.48 : 0.32;
  const hedgedExposure = Math.round(currencyExposure * hedgedPct);
  const unhedgedExposure = currencyExposure - hedgedExposure;
  const pnlVolatility = parseFloat((4.2 + (100 - score) * 0.082).toFixed(2));
  const fxVolatility = parseFloat((8.5 + (100 - score) * 0.12).toFixed(1));
  const var95 = Math.round(currencyExposure * 0.0145 * (1 + (100 - score) / 200));
  const es = Math.round(var95 * 1.52);

  return {
    company_id: active.name,
    market_fx_data: {
      var_95: var95,
      expected_shortfall: es,
      pnl_volatility: pnlVolatility,
      tail_risk_ratio: parseFloat((es / var95).toFixed(2)),
      currency_exposure: currencyExposure,
      hedged_exposure: hedgedExposure,
      unhedged_exposure: unhedgedExposure,
      fx_volatility: fxVolatility,
      cross_currency_basis: parseFloat((-0.12 - (100 - score) * 0.004).toFixed(2)),
      security_identifiers: Array.from({ length: 6 }, (_, i) => `IN${String(active.id * 1000 + i).padStart(10, "0")}`),
    },
  };
};

// Legacy export
export const marketRiskMockData = getMarketRiskMockData();
