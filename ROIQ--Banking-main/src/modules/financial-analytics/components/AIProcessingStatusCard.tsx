// src/modules/financial-analytics/components/AIProcessingStatusCard.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import { Loader2 } from "lucide-react"; // assuming lucide-react is available in project

export const AIProcessingStatusCard: React.FC = () => (
  <Card className="p-4 flex items-center space-x-2">
    <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
    <span className="text-sm text-muted-foreground">AI processing status: idle</span>
  </Card>
);
