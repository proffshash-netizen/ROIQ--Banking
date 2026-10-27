// src/modules/financial-analytics/components/OverallFinancialHealthIndicator.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput, LiquidityInput } from "../types";

type Props = {
  treasury?: TreasuryInput;
  liquidity?: LiquidityInput;
};

export const OverallFinancialHealthIndicator: React.FC<Props> = ({ treasury, liquidity }) => {
  // Simple mock health calculation: if both exist, show "Healthy"
  const health = treasury && liquidity ? "Healthy" : "Data Incomplete";
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Overall Financial Health</h3>
      <p className="text-sm">{health}</p>
    </Card>
  );
};
