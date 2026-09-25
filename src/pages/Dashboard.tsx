import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ShieldAlert, FileText, Activity, Building2, LineChart,
  AlertTriangle, CheckCircle2, Clock, Zap,
  BarChart3, Cpu, ArrowUpRight, ArrowDownRight, RefreshCw, Eye,
  ChevronRight, CircleDot, Briefcase
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCompaniesStore } from "@/stores/companiesStore"
import { useDashboardStore } from "@/stores/dashboardStore"
import { fetchDashboardKPIs } from "@/services/dashboard.service"
import { settingsService } from "@/services/settings.service"

/* ─── Static demo data (replaces backend until connected) ─── */

const recentActivity = [
  { id: 1, type: "analysis",    icon: BarChart3,    color: "text-blue-400",   title: "Credit risk analysis completed",          subject: "Adani Enterprises Ltd.",    time: "2 min ago",   status: "success" },
  { id: 2, type: "flag",        icon: AlertTriangle, color: "text-amber-400",  title: "High-risk flag raised",                   subject: "Vedanta Resources PLC",      time: "11 min ago",  status: "warning" },
  { id: 3, type: "report",      icon: FileText,      color: "text-violet-400", title: "Executive report generated",              subject: "Reliance Industries Ltd.",   time: "34 min ago",  status: "success" },
  { id: 4, type: "upload",      icon: RefreshCw,     color: "text-emerald-400","title": "Dataset ingestion started",             subject: "Tata Steel Ltd.",           time: "1 hr ago",    status: "running" },
  { id: 5, type: "review",      icon: Eye,           color: "text-sky-400",    title: "Loan recommendation under review",        subject: "Mahindra & Mahindra Ltd.",   time: "2 hr ago",    status: "pending" },
  { id: 6, type: "analysis",    icon: BarChart3,     color: "text-blue-400",   title: "Financial analytics refreshed",           subject: "HDFC Bank Ltd.",            time: "3 hr ago",    status: "success" },
]

const riskAlerts = [
  { id: 1, severity: "critical", company: "Vedanta Resources PLC",    issue: "Debt-to-equity ratio breached threshold (3.8x)",     score: 87 },
  { id: 2, severity: "high",     company: "Zee Entertainment Ltd.",    issue: "Revenue declining YoY for 3 consecutive quarters",  score: 74 },
]

const aiQueue = [
  { company: "Tata Steel Ltd.",          module: "Credit Risk",        progress: 72, eta: "~3 min"  },
  { company: "ONGC Ltd.",                module: "Financial Analytics", progress: 41, eta: "~8 min"  },
  { company: "Bajaj Finance Ltd.",       module: "Loan Recommendation", progress: 15, eta: "~19 min" },
]

const upcomingTasks = [
  { date: "Today,  16:00",  task: "Loan review board – Mahindra & Mahindra",  priority: "high"   },
  { date: "Today,  18:30",  task: "Compliance sign-off – HDFC Bank portfolio", priority: "medium" },
  { date: "Tomorrow, 09:00",task: "Quarterly stress-test run – full portfolio", priority: "high"   },
  { date: "Tomorrow, 14:00",task: "Executive briefing – ROIQ AI findings",     priority: "low"    },
]

const priorityColor = { high: "text-rose-400 bg-rose-400/10", medium: "text-amber-400 bg-amber-400/10", low: "text-emerald-400 bg-emerald-400/10" }
const severityColor = { critical: "border-rose-500/50 bg-rose-500/5", high: "border-amber-500/50 bg-amber-500/5" }

export function Dashboard() {
  const navigate = useNavigate()
  const { companies } = useCompaniesStore()
  const updateKPIs = useDashboardStore((state) => state.updateKPIs)
  const [isBackendOnline, setIsBackendOnline] = useState(false)

  useEffect(() => {
    // Probe backend status and load KPIs
    settingsService.getSystemStatus().then((status) => {
      setIsBackendOnline(status.backend === "Running")
    })

    fetchDashboardKPIs().then((kpis) => {
      updateKPIs(kpis)
    })
  }, [updateKPIs])

  const systemStatus = [
    { name: "AI Inference Engine",  ok: true },
    { name: "Data Pipeline",        ok: true },
    { name: "Report Generator",     ok: true },
    { name: "Backend API",          ok: isBackendOnline },
  ]

  // Dynamic precise calculations based on reference companies module dataset
  // KPI 1: total companies in store
  const companiesEvaluated = companies.length;

  // KPI 2: total loan exposure across all companies
  const totalExposureSum = companies.reduce((sum, c) => {
    let val = 0;
    if (c.loanExposure.includes("B")) {
      val = parseFloat(c.loanExposure.replace(/[^0-9.]/g, "")) * 1000;
    } else if (c.loanExposure.includes("M")) {
      val = parseFloat(c.loanExposure.replace(/[^0-9.]/g, ""));
    }
    return sum + val;
  }, 0);
  const formattedLoanValue = totalExposureSum >= 1000
    ? `${(totalExposureSum / 1000).toFixed(2)}B`
    : `${totalExposureSum.toFixed(2)}M`;

  // KPI 3: companies flagged as high or critical risk
  const highRiskFlags = companies.filter(c => c.riskLevel === "high" || c.riskLevel === "critical").length;

  // KPI 4: companies with status "completed" (reports generated)
  const reportsGenerated = companies.filter(c => c.status === "completed").length;

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time corporate credit intelligence · AI-powered risk analysis · Thursday, 24 Jul 2026
          </p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="flex items-center gap-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <FileText className="h-3.5 w-3.5" /> View Executive Report <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate("/companies")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Evaluated</CardTitle>
            <Building2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesEvaluated}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">+3</span>&nbsp;since last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate("/analytics")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Value</CardTitle>
            <LineChart className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formattedLoanValue}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">+12.4%</span>&nbsp;portfolio growth QoQ
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-destructive/40 transition-colors cursor-pointer" onClick={() => navigate("/risk")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Flags</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highRiskFlags}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-rose-400" />
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate("/report")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsGenerated}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3" />
              Last generated 34 min ago
            </p>
          </CardContent>
        </Card>
      </div>


      {/* ── Main content grid ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4 text-violet-400" /> Recent Activity
            </CardTitle>
            <CardDescription className="text-xs">Platform events across all modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/20 transition-colors">
                <div className={`mt-0.5 rounded-full bg-muted/30 p-1.5 ${ev.color}`}>
                  <ev.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug">{ev.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{ev.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{ev.time}</span>
                  {ev.status === "success" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  {ev.status === "warning" && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                  {ev.status === "running" && <RefreshCw className="h-3 w-3 text-sky-400 animate-spin" />}
                  {ev.status === "pending" && <Clock className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">

          {/* Risk Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="h-4 w-4 text-rose-400" /> Active Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {riskAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-md border px-3 py-2.5 ${severityColor[a.severity as keyof typeof severityColor]}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold">{a.company}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${a.severity === "critical" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"}`}>
                      Score {a.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{a.issue}</p>
                </div>
              ))}
              <button
                onClick={() => navigate("/risk")}
                className="w-full text-center text-[11px] text-primary hover:underline mt-1"
              >
                View all in Credit Risk →
              </button>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="h-4 w-4 text-sky-400" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {systemStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className={`flex items-center gap-1 font-medium ${s.ok ? "text-emerald-400" : "text-rose-400"}`}>
                    <CircleDot className="h-3 w-3" />
                    {s.ok ? "Operational" : "Degraded"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── AI Processing Queue + Upcoming Tasks ── */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* AI Processing Queue */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-amber-400" /> AI Processing Queue
            </CardTitle>
            <CardDescription className="text-xs">Active inference jobs across all modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiQueue.map((q, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div>
                    <span className="font-medium">{q.company}</span>
                    <span className="text-muted-foreground ml-2">·&nbsp;{q.module}</span>
                  </div>
                  <span className="text-muted-foreground">{q.eta}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700"
                    style={{ width: `${q.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{q.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4 text-violet-400" /> Upcoming Tasks
            </CardTitle>
            <CardDescription className="text-xs">Scheduled reviews and compliance deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/20 transition-colors">
                <div className="shrink-0 text-[10px] text-muted-foreground w-28 pt-0.5 leading-snug">{t.date}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug">{t.task}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${priorityColor[t.priority as keyof typeof priorityColor]}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

    </div>
  )
}
