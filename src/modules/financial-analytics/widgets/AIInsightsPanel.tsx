// AI Insights & LangGraph Status Panel Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AIWorkflowStatus } from "../types";
import { Activity, CheckCircle2, Server, HelpCircle } from "lucide-react";

interface Props {
  data: AIWorkflowStatus;
}

export const AIInsightsPanel: React.FC<Props> = ({ data }) => {
  return (
    <Card className="col-span-1 md:col-span-2 border border-[#E2E8F0] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#E2E8F0]">
        <CardTitle className="text-sm font-semibold text-[#172033]">Analytics engine orchestration</CardTitle>
        <Activity className="h-4 w-4 text-[#2457D6]" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#64748B]">Orchestrator pipeline</span>
            <span className="text-xs font-medium text-[#16805B]">{data.engine}</span>
          </div>
          <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <p className="text-xs text-[#172033] leading-relaxed">{data.overallInsight}</p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block mb-2">Agent workflow execution</span>
          <div className="space-y-2">
            {data.workflows.map((wf, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#E2E8F0] last:border-0">
                <span className="text-[#64748B]">{wf.name}</span>
                <span className="flex items-center gap-1 text-[#16805B] font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16805B]" />
                  {wf.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <span className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1 mb-1">
              <Server className="h-3 w-3 text-[#2457D6]" /> LangGraph state
            </span>
            <span className="text-xs font-semibold text-[#172033]">{data.langGraphStatus}</span>
          </div>
          <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <span className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1 mb-1">
              <HelpCircle className="h-3 w-3 text-[#16805B]" /> System backend
            </span>
            <span className="text-xs font-semibold text-[#16805B]">{data.backendStatus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

