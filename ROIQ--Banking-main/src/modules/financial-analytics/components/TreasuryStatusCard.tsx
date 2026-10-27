// src/modules/financial-analytics/components/TreasuryStatusCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import type { TreasuryInput } from "../types";

interface Props {
  data: TreasuryInput;
}

export const TreasuryStatusCard: React.FC<Props> = ({ data }) => (
  <Card className="p-4">
    <h3 className="text-lg font-medium mb-2">Treasury Status</h3>
    <pre className="text-sm text-muted-foreground overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
  </Card>
);
