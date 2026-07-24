// src/modules/financial-analytics/components/LiquidityCoverageSummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { LiquidityInput } from "../types";

interface Props {
  data: LiquidityInput;
}

export const LiquidityCoverageSummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Liquidity Coverage Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify({ liquidity_ratios: data.liquidity_ratios }, null, 2)}
    </pre>
  </Card>
);
