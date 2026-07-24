// src/modules/financial-analytics/components/TreasurySummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput } from "../types";

interface Props {
  data: TreasuryInput;
}

export const TreasurySummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Treasury Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify({ bond_portfolio: data.bond_portfolio, treasury_securities: data.treasury_securities }, null, 2)}
    </pre>
  </Card>
);
