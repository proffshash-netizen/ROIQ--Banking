// Loan Recommendation – Shared UI Components & Badges
// Enterprise UI styling matching ROIQ AI design system.

import React from "react";
import type { RiskLevel, DecisionOutcome } from "../types";
import { Sparkles } from "lucide-react";

export function getRiskBadgeVariant(level: RiskLevel | string): string {
  switch (level) {
    case "Low":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Medium":
    case "Moderate":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "High":
    case "Critical":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    default:
      return "bg-purple-950/40 text-purple-200/70 border-purple-500/20";
  }
}

export function getRiskColor(level: RiskLevel | string): string {
  switch (level) {
    case "Low":
      return "hsl(142 76% 45%)";
    case "Medium":
    case "Moderate":
      return "hsl(272 85% 65%)";
    case "High":
      return "hsl(352 82% 54%)";
    case "Critical":
      return "hsl(350 85% 42%)";
    default:
      return "hsl(272 40% 70%)";
  }
}

export function getDecisionBadgeVariant(decision: DecisionOutcome | string): string {
  switch (decision) {
    case "APPROVE":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    case "APPROVE WITH CONDITIONS":
      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
    case "FURTHER REVIEW":
      return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    case "REJECT":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    default:
      return "bg-purple-950/40 text-purple-200/70 border-purple-500/30";
  }
}

interface RiskBadgeProps {
  level: RiskLevel | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => (
  <span
    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getRiskBadgeVariant(
      level
    )}`}
  >
    {level} Risk
  </span>
);

interface DecisionBadgeProps {
  decision: DecisionOutcome | string;
  size?: "sm" | "md" | "lg";
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, size = "md" }) => {
  const sizeClasses =
    size === "lg"
      ? "px-4 py-1.5 text-base font-bold"
      : size === "sm"
      ? "px-2.5 py-0.5 text-xs font-semibold"
      : "px-3 py-1 text-sm font-bold";

  return (
    <span
      className={`inline-flex items-center rounded-lg border tracking-wide uppercase shadow-sm transition-all ${sizeClasses} ${getDecisionBadgeVariant(
        decision
      )}`}
    >
      {decision}
    </span>
  );
};

interface MetricRowProps {
  label: string;
  value: React.ReactNode;
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

interface AISummaryProps {
  text: string;
  title?: string;
}

export const AISummaryCard: React.FC<AISummaryProps> = ({ text, title = "AI Business Summary" }) => (
  <div className="mt-3 rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
    <div className="flex items-center gap-1.5 mb-1 text-purple-400">
      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
      <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  icon,
}) => (
  <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
    <div className="flex items-center gap-3">
      {icon && <div className="p-2 rounded-lg bg-muted/60 text-primary">{icon}</div>}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {badgeText && (
      <span className="text-[11px] font-semibold text-muted-foreground bg-muted/50 border border-border/50 rounded-md px-2.5 py-1">
        {badgeText}
      </span>
    )}
  </div>
);

export const LoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-pulse">
    <div className="h-8 w-64 rounded bg-muted/60" />
    <div className="h-4 w-96 rounded bg-muted/40" />
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-muted/40" />
      ))}
    </div>
    <div className="h-48 rounded-xl bg-muted/40 mt-6" />
    <div className="h-64 rounded-xl bg-muted/40 mt-6" />
  </div>
);
