// Credit Risk – Shared UI Components
// Professional enterprise banking styling

import React from "react";
import type { RiskLevel, TrendDirection } from "../types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-[#16805B]/10 text-[#16805B] border-[#16805B]/20",
  warning: "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20",
  danger: "bg-[#C53D3D]/10 text-[#C53D3D] border-[#C53D3D]/20",
  info: "bg-[#2457D6]/10 text-[#2457D6] border-[#2457D6]/20",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export function getRiskVariant(level: RiskLevel | string): BadgeVariant {
  const norm = String(level).toLowerCase();
  if (norm.includes("low") || norm.includes("investment")) return "success";
  if (norm.includes("med") || norm.includes("mod")) return "warning";
  if (norm.includes("high") || norm.includes("crit")) return "danger";
  return "neutral";
}

export function getRiskColor(level: RiskLevel | string): string {
  const norm = String(level).toLowerCase();
  if (norm.includes("low")) return "#16805B";
  if (norm.includes("med") || norm.includes("mod")) return "#B7791F";
  if (norm.includes("high")) return "#C53D3D";
  if (norm.includes("crit")) return "#9F2D2D";
  return "#2457D6";
}

interface RiskBadgeProps {
  level: RiskLevel | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => (
  <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${variantClasses[getRiskVariant(level)]}`}>
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
      direction === "up" ? "text-[#C53D3D]" : direction === "down" ? "text-[#16805B]" : "text-slate-500"
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
  <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
    <span className="text-xs text-[#64748B]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#172033]">{value}</span>
      {badge}
    </div>
  </div>
);

interface AIInsightProps {
  text: string;
  title?: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({ text, title = "Analyst Rationale" }) => (
  <div className="mt-3 rounded border border-[#E2E8F0] bg-slate-50 p-3">
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2457D6]" />
      <span className="text-[11px] font-semibold text-[#172033]">{title}</span>
    </div>
    <p className="text-xs text-[#64748B] leading-relaxed">{text}</p>
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-3 mb-4">
    {icon && <div className="p-2 rounded border border-[#E2E8F0] bg-slate-50 text-[#172033]">{icon}</div>}
    <div>
      <h2 className="text-base font-semibold text-[#172033]">{title}</h2>
      {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const LoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
    <div className="h-8 w-64 rounded bg-slate-200" />
    <div className="h-4 w-96 rounded bg-slate-100" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-slate-100 border border-slate-200" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-64 rounded-lg bg-slate-100 border border-slate-200" />
      ))}
    </div>
  </div>
);
