// Credit Risk – Shared UI Components
// Reuses the same patterns as the financial-analytics module for consistency.

import React from "react";
import type { RiskLevel, TrendDirection } from "../types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
  info: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  neutral: "bg-purple-950/40 text-purple-200/70 border-purple-500/20",
};

export function getRiskVariant(level: RiskLevel | string): BadgeVariant {
  switch (level) {
    case "Low": return "success";
    case "Moderate": return "warning";
    case "High": return "danger";
    case "Critical": return "danger";
    default: return "neutral";
  }
}

export function getRiskColor(level: RiskLevel | string): string {
  switch (level) {
    case "Low": return "hsl(142 76% 45%)";
    case "Moderate": return "hsl(272 85% 65%)";
    case "High": return "hsl(352 82% 54%)";
    case "Critical": return "hsl(350 85% 42%)";
    default: return "hsl(272 40% 70%)";
  }
}

interface RiskBadgeProps {
  level: RiskLevel | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => (
  <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[getRiskVariant(level)]}`}>
    {level}
  </span>
);

interface TrendIndicatorProps {
  direction: TrendDirection;
  value?: number;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, value }) => {
  const iconClass = "h-3.5 w-3.5";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
      direction === "up" ? "text-red-400" : direction === "down" ? "text-emerald-400" : "text-zinc-400"
    }`}>
      {direction === "up" && <TrendingUp className={iconClass} />}
      {direction === "down" && <TrendingDown className={iconClass} />}
      {direction === "stable" && <Minus className={iconClass} />}
      {value !== undefined && <span>{value > 0 ? "+" : ""}{value.toFixed(1)}%</span>}
    </span>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
  badge?: React.ReactNode;
}

export const MetricRow: React.FC<MetricRowProps> = ({ label, value, badge }) => (
  <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{value}</span>
      {badge}
    </div>
  </div>
);

interface AIInsightProps {
  text: string;
  title?: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({ text, title = "AI Insight" }) => (
  <div className="mt-4 rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">{title}</span>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-3 mb-4">
    {icon && <div className="p-2 rounded-lg bg-muted/60">{icon}</div>}
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const LoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
    <div className="h-8 w-64 rounded bg-muted/60" />
    <div className="h-4 w-96 rounded bg-muted/40" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-muted/40" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-72 rounded-xl bg-muted/40" />
      ))}
    </div>
  </div>
);
