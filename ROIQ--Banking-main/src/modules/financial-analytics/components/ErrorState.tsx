// src/modules/financial-analytics/components/ErrorState.tsx
import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <Card className="p-6 flex flex-col items-center justify-center space-y-4">
    <div className="text-destructive-foreground">{message}</div>
    <Button onClick={onRetry}>Retry</Button>
  </Card>
);
