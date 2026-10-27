// src/modules/financial-analytics/components/DurationSummaryCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput } from "../types";

interface Props {
  data: TreasuryInput;
}

export const DurationSummaryCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Duration Summary</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">
      {JSON.stringify(data.duration_information, null, 2)}
    </pre>
  </Card>
);
