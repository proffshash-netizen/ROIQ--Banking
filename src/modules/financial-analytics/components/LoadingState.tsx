// src/modules/financial-analytics/components/LoadingState.tsx
import { Card } from "../../../components/ui/card";

export const LoadingState = () => (
  <Card className="p-6 flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading financial analytics…</div>
  </Card>
);
