// src/modules/financial-analytics/components/InterestRateSummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput } from "../types";

interface Props {
  data: TreasuryInput;
}

export const InterestRateSummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Interest Rate Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify(data.interest_rate_information, null, 2)}
    </pre>
  </Card>
);
