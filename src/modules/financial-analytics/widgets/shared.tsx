// Shared widget sub-components
import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-[#16805B]/10 text-[#16805B] border-[#16805B]/20",
  warning: "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20",
  danger: "bg-[#C53D3D]/10 text-[#C53D3D] border-[#C53D3D]/20",
  info: "bg-[#2457D6]/10 text-[#2457D6] border-[#2457D6]/20",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = "neutral" }) => (
  <span
    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${variantClasses[variant]}`}
  >
    {label}
  </span>
);

export function getComplianceVariant(status: string): BadgeVariant {
  const norm = String(status).toLowerCase();
  if (norm.includes("compliant") && !norm.includes("non")) return "success";
  if (norm.includes("warn")) return "warning";
  if (norm.includes("non") || norm.includes("breach") || norm.includes("danger")) return "danger";
  return "neutral";
}

export function getRiskVariant(level: string): BadgeVariant {
  const norm = String(level).toLowerCase();
  if (norm.includes("low")) return "success";
  if (norm.includes("med") || norm.includes("mod")) return "warning";
  if (norm.includes("high") || norm.includes("crit")) return "danger";
  return "neutral";
}

export function getHealthVariant(health: string): BadgeVariant {
  const norm = String(health).toLowerCase();
  if (norm.includes("strong") || norm.includes("healthy")) return "success";
  if (norm.includes("adequate")) return "warning";
  if (norm.includes("weak") || norm.includes("crit")) return "danger";
  return "neutral";
}

interface KPIProps {
  label: string;
  value: string;
  sub?: string;
}

export const KPI: React.FC<KPIProps> = ({ label, value, sub }) => (
  <div className="space-y-1">
    <p className="text-xs text-[#64748B]">{label}</p>
    <p className="text-xl font-bold tracking-tight text-[#172033]">{value}</p>
    {sub && <p className="text-xs text-[#64748B]">{sub}</p>}
  </div>
);

interface MetricRowProps {
  label: string;
  value: string;
}

export const MetricRow: React.FC<MetricRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0] last:border-0">
    <span className="text-xs text-[#64748B]">{label}</span>
    <span className="text-sm font-medium text-[#172033]">{value}</span>
  </div>
);

interface AIInsightProps {
  text: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({ text }) => (
  <div className="mt-3 rounded border border-[#E2E8F0] bg-slate-50 p-3">
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2457D6]" />
      <span className="text-[11px] font-semibold text-[#172033]">Analyst Interpretation</span>
    </div>
    <p className="text-xs text-[#64748B] leading-relaxed">{text}</p>
  </div>
);

interface WidgetTimestampProps {
  date: string;
}

export const WidgetTimestamp: React.FC<WidgetTimestampProps> = ({ date }) => (
  <p className="text-[10px] text-[#94A3B8] mt-3">Last updated: {date}</p>
);

