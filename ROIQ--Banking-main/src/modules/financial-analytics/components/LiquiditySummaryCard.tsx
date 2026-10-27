// src/modules/financial-analytics/components/LiquiditySummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { LiquidityInput } from "../types";

interface Props {
  data: LiquidityInput;
}

export const LiquiditySummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Liquidity Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify({ cash_positions: data.cash_positions, liquid_assets: data.liquid_assets }, null, 2)}
    </pre>
  </Card>
);
