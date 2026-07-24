// Loading skeletons for Forecast module
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const WidgetSkeleton: React.FC = () => (
  <Card className="col-span-1 border-dashed">
    <CardHeader className="space-y-2 pb-2">
      <div className="h-4 w-1/3 rounded bg-muted/60 animate-pulse" />
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="h-8 w-2/3 rounded bg-muted/60 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted/40 animate-pulse" />
        <div className="h-4 w-full rounded bg-muted/40 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

export const ForecastPageSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-2">
      <div className="h-8 w-64 rounded bg-muted/80 animate-pulse" />
      <div className="h-4 w-96 rounded bg-muted/60 animate-pulse" />
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <WidgetSkeleton />
      <WidgetSkeleton />
      <WidgetSkeleton />
    </div>

    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 border-dashed">
        <CardContent className="py-20 flex justify-center items-center">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-4 w-1/4 rounded bg-muted/60 animate-pulse mx-auto" />
            <div className="h-32 rounded bg-muted/40 animate-pulse" />
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 border-dashed">
        <CardContent className="py-20 flex justify-center items-center">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-4 w-1/4 rounded bg-muted/60 animate-pulse mx-auto" />
            <div className="h-32 rounded bg-muted/40 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
