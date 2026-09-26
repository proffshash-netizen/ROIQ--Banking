// AI Insights & LangGraph Status Panel Widget
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AIWorkflowStatus } from "../types";
import { Cpu, CheckCircle2, Server, HelpCircle } from "lucide-react";

interface Props {
  data: AIWorkflowStatus;
}

export const AIInsightsPanel: React.FC<Props> = ({ data }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ROIQ AI Engine Status</CardTitle>
        <Cpu className="h-4 w-4 text-purple-400 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground">AI Orchestrator</span>
            <span className="text-xs font-medium text-emerald-400">{data.engine}</span>
          </div>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
            <p className="text-xs text-zinc-300 leading-relaxed">{data.overallInsight}</p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Agent Workflow Execution</span>
          <div className="space-y-2">
            {data.workflows.map((wf, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">{wf.name}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {wf.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
              <Server className="h-3 w-3 text-purple-400" /> LangGraph Status
            </span>
            <span className="text-xs font-medium text-purple-400">{data.langGraphStatus}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
              <HelpCircle className="h-3 w-3 text-emerald-400" /> System Backend
            </span>
            <span className="text-xs font-medium text-emerald-400">{data.backendStatus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
