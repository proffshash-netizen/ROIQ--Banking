// src/modules/financial-analytics/components/PortfolioSummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput, LiquidityInput } from "../types";

type Props = {
  treasury: TreasuryInput;
  liquidity: LiquidityInput;
};

export const PortfolioSummaryCard: React.FC<Props> = ({ treasury, liquidity }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Portfolio Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify({ bond_portfolio: treasury.bond_portfolio, liquid_assets: liquidity.liquid_assets }, null, 2)}
    </pre>
  </Card>
);
