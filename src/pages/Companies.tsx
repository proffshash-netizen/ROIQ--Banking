import React, { useState } from "react"
import {
  Building2, Search, BarChart3,
  RefreshCw, CheckCircle2, AlertTriangle, Clock,
  Globe, Cpu, ChevronDown, Filter, ArrowUpRight, CircleDot
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCompaniesStore } from "@/stores/companiesStore"
import { cn } from "@/lib/utils"

const riskMeta: Record<string, { label: string; color: string; bg: string }> = {
  low:      { label: "Low",      color: "text-emerald-400", bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  medium:   { label: "Medium",   color: "text-purple-400",  bg: "bg-purple-500/10  text-purple-400  border border-purple-500/20" },
  high:     { label: "High",     color: "text-red-400",     bg: "bg-red-500/10     text-red-400     border border-red-500/20" },
  critical: { label: "Critical", color: "text-red-400",     bg: "bg-red-500/20     text-red-400     border border-red-500/30" },
}

const statusMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  processing: { label: "Processing", icon: RefreshCw,     color: "text-purple-400"  },
  completed:  { label: "Completed",  icon: CheckCircle2,  color: "text-emerald-400" },
  flagged:    { label: "Flagged",    icon: AlertTriangle, color: "text-red-400"     },
  pending:    { label: "Queued",     icon: Clock,         color: "text-purple-300/70" },
}

const stats = [
  { label: "Total Companies",   value: "9",       icon: Building2,   color: "text-purple-400"  },
  { label: "Avg. Credit Score", value: "68.1",    icon: BarChart3,   color: "text-purple-300"  },
  { label: "Total Exposure",    value: "$4.53 B", icon: Globe,       color: "text-emerald-400" },
  { label: "Active Processing", value: "3",       icon: Cpu,         color: "text-purple-400"  },
]

export function Companies() {
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase())
    const matchRisk = riskFilter === "all" || c.riskLevel === riskFilter
    const matchStatus = statusFilter === "all" || c.status === statusFilter
    return matchSearch && matchRisk && matchStatus
  })

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Corporate credit portfolio · {companies.length} entities tracked · AI-evaluated risk profiles
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                className="w-full rounded-md border border-border bg-transparent pl-8 pr-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search by company or sector…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Risk filter */}
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                className="rounded-md border border-border bg-card pl-8 pr-7 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                className="rounded-md border border-border bg-card px-3 pr-7 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="flagged">Flagged</option>
                <option value="pending">Queued</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} of {companies.length} companies
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2 className="h-4 w-4 text-purple-400" /> Corporate Portfolio
          </CardTitle>
          <CardDescription className="text-xs">Click any row to view detailed profile</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">#</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Sector</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Revenue</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Credit Score</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Loan Exposure</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                      No companies match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((c) => {
                  const risk = riskMeta[c.riskLevel]
                  const stat = statusMeta[c.status]
                  const StatusIcon = stat.icon
                  const isOpen = expanded === c.id
                  return (
                    <React.Fragment key={c.id}>
                      <tr
                        key={c.id}
                        className={cn(
                          "hover:bg-muted/10 transition-colors cursor-pointer relative",
                          selectedCompanyId === c.id ? "bg-primary/10 border-l-2 border-l-primary font-medium" : ""
                        )}
                        onClick={() => {
                          selectCompany(c.id)
                          setExpanded(isOpen ? null : c.id)
                        }}
                      >
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{String(c.id).padStart(2, "0")}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.hq}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{c.sector}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">{c.revenue}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-sm font-bold ${c.creditScore >= 75 ? "text-emerald-400" : c.creditScore >= 55 ? "text-purple-400" : "text-red-400"}`}>
                              {c.creditScore}
                            </span>
                            <div className="h-1 w-14 rounded-full bg-muted/30 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${c.creditScore >= 75 ? "bg-emerald-400" : c.creditScore >= 55 ? "bg-purple-400" : "bg-red-400"}`}
                                style={{ width: `${c.creditScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${risk.bg}`}>
                            {risk.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold hidden lg:table-cell">{c.loanExposure}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${stat.color}`}>
                            <StatusIcon className={`h-3 w-3 ${c.status === "processing" ? "animate-spin" : ""}`} />
                            {stat.label}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isOpen && (
                        <tr key={`${c.id}-detail`} className="bg-muted/5">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Company Details</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between"><span className="text-muted-foreground">CEO</span><span className="font-medium">{c.ceo}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Founded</span><span className="font-medium">{c.founded}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Employees</span><span className="font-medium">{c.employees}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="font-medium">{c.country}</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Financial Exposure</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">{c.revenue}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Loan Exposure</span><span className="font-semibold text-emerald-400">{c.loanExposure}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Credit Score</span><span className={`font-bold ${c.creditScore >= 75 ? "text-emerald-400" : c.creditScore >= 55 ? "text-purple-400" : "text-red-400"}`}>{c.creditScore} / 100</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">AI Analysis</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Module</span><span className="font-medium">{c.module}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Last Updated</span><span className="font-medium">{c.lastAnalysis}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">ETA</span><span className="font-medium">{c.eta}</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Processing Progress</p>
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{stat.label}</span>
                                    <span className="font-semibold">{c.progress}%</span>
                                  </div>
                                  <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-700 ${c.progress === 100 ? (c.status === "flagged" ? "bg-rose-400" : "bg-emerald-400") : "bg-gradient-to-r from-primary/60 to-primary"}`}
                                      style={{ width: `${c.progress}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <CircleDot className={`h-3 w-3 ${riskMeta[c.riskLevel].color}`} />
                                    <span className={`text-[11px] font-semibold ${riskMeta[c.riskLevel].color}`}>
                                      {riskMeta[c.riskLevel].label} Risk
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Risk Distribution */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["low","medium","high","critical"] as const).map((level) => {
          const count = companies.filter((c) => c.riskLevel === level).length
          const pct = Math.round((count / companies.length) * 100)
          const meta = riskMeta[level]
          return (
            <Card key={level} className="hover:border-primary/20 transition-colors">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{meta.label} Risk</span>
                  <span className="text-xl font-bold">{count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                  <div className={`h-full rounded-full ${meta.color.replace("text-","bg-")}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{pct}% of portfolio</p>
                <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3" />
                  {companies.filter((c) => c.riskLevel === level).map(c => c.name.split(" ")[0]).join(", ")}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
