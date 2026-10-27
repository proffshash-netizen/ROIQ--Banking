// src/modules/financial-analytics/components/NetStableFundingSummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { LiquidityInput } from "../types";

interface Props {
  data: LiquidityInput;
}

export const NetStableFundingSummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Net Stable Funding Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify({ funding_information: data.funding_information, debt_obligations: data.debt_obligations }, null, 2)}
    </pre>
  </Card>
);
