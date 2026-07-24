// Shared widget elements for Forecast module
import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  neutral: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = "neutral" }) => (
  <span
    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]}`}
  >
    {label}
  </span>
);

export function getRiskVariant(rating: string): BadgeVariant {
  if (["A", "AA", "AAA", "BBB-", "BBB"].includes(rating)) return "success";
  if (["BB", "B"].includes(rating)) return "warning";
  return "danger";
}

interface KPIProps {
  label: string;
  value: string;
  sub?: string;
}

export const KPI: React.FC<KPIProps> = ({ label, value, sub }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-bold tracking-tight">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

interface MetricRowProps {
  label: string;
  value: string;
}

export const MetricRow: React.FC<MetricRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

interface AIInsightProps {
  text: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({ text }) => (
  <div className="mt-4 rounded-lg bg-blue-500/5 border border-blue-500/10 p-3">
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">AI Forecasting Assessment</span>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);
