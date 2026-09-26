import { useState, useEffect } from "react"
import { ShieldAlert, FileText, ArrowRight, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCompaniesStore } from "@/stores/companiesStore"
import { useDashboardStore } from "@/stores/dashboardStore"
import { fetchDashboardKPIs } from "@/services/dashboard.service"
import { settingsService } from "@/services/settings.service"
import ReactEChartsCore from "echarts-for-react"

export function Dashboard() {
  const navigate = useNavigate()
  const { companies, selectCompany } = useCompaniesStore()
  const updateKPIs = useDashboardStore(state => state.updateKPIs)
  const [, setIsBackendOnline] = useState(false)

  useEffect(() => {
    settingsService.getSystemStatus().then(status => setIsBackendOnline(status.backend === "Running"))
    fetchDashboardKPIs().then(kpis => updateKPIs(kpis))
  }, [updateKPIs])

  // Portfolio calculations
  const companiesCount = companies.length || 9
  const toMillion = (v: string) => {
    if (v.includes("B")) return parseFloat(v.replace(/[^0-9.]/g, "")) * 1000
    if (v.includes("M")) return parseFloat(v.replace(/[^0-9.]/g, ""))
    return 0
  }
  const totalExposure = companies.reduce((s, c) => s + toMillion(c.loanExposure), 0)
  const formattedTotal = totalExposure >= 1000
    ? `₹${(totalExposure / 1000).toFixed(2)}B`
    : `₹${totalExposure.toFixed(0)}M`

  const highRiskCos = companies.filter(c => c.riskLevel === "high" || c.riskLevel === "critical")
  const highRiskExposure = highRiskCos.reduce((s, c) => s + toMillion(c.loanExposure), 0)
  const formattedHighRisk = highRiskExposure >= 1000
    ? `₹${(highRiskExposure / 1000).toFixed(2)}B`
    : `₹${highRiskExposure.toFixed(0)}M`

  const avgScore = companies.length
    ? (companies.reduce((s, c) => s + (c.creditScore || 68), 0) / companies.length).toFixed(1)
    : "68.1"
  const pendingReviews = highRiskCos.length || 3

  // Sector breakdown
  const sectorData: Record<string, { count: number; exposure: number }> = {}
  companies.forEach(c => {
    const val = toMillion(c.loanExposure)
    if (!sectorData[c.sector]) sectorData[c.sector] = { count: 0, exposure: 0 }
    sectorData[c.sector].count += 1
    sectorData[c.sector].exposure += val
  })

  // Chart — banking professional bar chart
  const riskDistOption = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#FFFFFF",
      borderColor: "#D9E1EA",
      borderWidth: 1,
      textStyle: { color: "#172033", fontSize: 12 },
    },
    grid: { top: 20, right: 16, bottom: 30, left: 30, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: ["Investment Grade", "Moderate", "Elevated", "Critical"],
      axisLine: { lineStyle: { color: "#D9E1EA" } },
      axisTick: { show: false },
      axisLabel: { color: "#5F6F85", fontSize: 11 },
    },
    yAxis: {
      type: "value" as const,
      minInterval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#EBF0F7", type: "solid" as const } },
      axisLabel: { color: "#5F6F85", fontSize: 11 },
    },
    series: [{
      name: "Companies",
      type: "bar",
      barWidth: 40,
      data: [
        { value: companies.filter(c => c.riskLevel === "low").length,     itemStyle: { color: "#238B5B", borderRadius: [3, 3, 0, 0] } },
        { value: companies.filter(c => c.riskLevel === "medium").length,  itemStyle: { color: "#1E4FA3", borderRadius: [3, 3, 0, 0] } },
        { value: companies.filter(c => c.riskLevel === "high").length,    itemStyle: { color: "#C98A16", borderRadius: [3, 3, 0, 0] } },
        { value: companies.filter(c => c.riskLevel === "critical").length,itemStyle: { color: "#C74646", borderRadius: [3, 3, 0, 0] } },
      ],
    }],
  }

  // Recent credit actions (audit log)
  const auditEvents = companies.slice(0, 6).map((c, i) => ({
    id: i + 1,
    company: c.name,
    action: c.riskLevel === "critical" ? "Credit review" : "Risk assessment",
    officer: "Thomas Shelby",
    time: `${(i + 1) * 14} min ago`,
    status: c.riskLevel === "critical" || c.riskLevel === "high" ? "Pending" : "Completed",
    isWarning: c.riskLevel === "critical" || c.riskLevel === "high",
  }))

  return (
    <div className="space-y-5 pb-10 max-w-[1600px] mx-auto">

      {/* ── Breadcrumb ── */}
      <nav className="bank-breadcrumb">
        <span>Home</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span>Portfolio</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span className="text-[#172033] font-medium">Dashboard</span>
      </nav>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="bank-h1">Portfolio Overview</h1>
          <p className="bank-body mt-1">
            Risk and exposure monitoring across the corporate loan portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate("/risk")}
            className="btn-primary"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Assess Credit Risk
          </button>
          <button
            onClick={() => navigate("/report")}
            className="btn-secondary"
          >
            <FileText className="h-3.5 w-3.5" />
            Executive Report
          </button>
        </div>
      </div>

      {/* ── Portfolio Summary Strip ── */}
      <div className="bank-panel">
        <div className="bank-panel-header">
          <h2 className="bank-h3">Portfolio Summary</h2>
          <span className="text-[11px] text-[#5F6F85]">As of today</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#D9E1EA]">
          {[
            { label: "Portfolio Exposure", value: formattedTotal, sub: "+12.4% vs last year", subCls: "text-[#238B5B]" },
            { label: "Monitored Companies", value: String(companiesCount), sub: "Active credit accounts", subCls: "text-[#5F6F85]" },
            { label: "Average Risk Score", value: `${avgScore} / 100`, sub: "Moderate risk tier", subCls: "text-[#C98A16]" },
            { label: "High-Risk Exposure", value: formattedHighRisk, sub: `${highRiskCos.length} companies require attention`, subCls: "text-[#C74646]" },
            { label: "Pending Reviews", value: String(pendingReviews), sub: "Credit review required", subCls: "text-[#C98A16]", span2: true },
          ].map((item, i) => (
            <div key={i} className={`p-4 ${item.span2 ? "col-span-2 md:col-span-1" : ""}`}>
              <div className="text-[11px] font-semibold text-[#5F6F85] uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-[22px] font-bold text-[#172033] leading-tight">{item.value}</div>
              <div className={`text-[11px] mt-0.5 ${item.subCls}`}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mid Grid: Chart + Queue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Portfolio Risk Distribution */}
        <div className="lg:col-span-8 bank-panel">
          <div className="bank-panel-header">
            <div>
              <h2 className="bank-h3">Portfolio Risk Distribution</h2>
              <p className="text-[11px] text-[#5F6F85] mt-0.5">Companies by current credit risk category</p>
            </div>
            <span className="text-[11px] text-[#5F6F85]">Updated today</span>
          </div>
          <div className="p-4">
            <ReactEChartsCore option={riskDistOption} style={{ height: 220 }} notMerge />
          </div>
          {/* Legend row */}
          <div className="px-4 pb-3 flex flex-wrap gap-4 border-t border-[#EBF0F7]">
            {[
              { label: "Investment Grade", color: "#238B5B" },
              { label: "Moderate", color: "#1E4FA3" },
              { label: "Elevated", color: "#C98A16" },
              { label: "Critical", color: "#C74646" },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-[#5F6F85] pt-2.5">
                <span className="h-2 w-2 rounded-sm inline-block" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Credit Review Queue */}
        <div className="lg:col-span-4 bank-panel flex flex-col">
          <div className="bank-panel-header">
            <div>
              <h2 className="bank-h3">Credit Review Queue</h2>
              <p className="text-[11px] text-[#5F6F85] mt-0.5">Companies awaiting officer review</p>
            </div>
            <span className="text-[11px] font-semibold text-[#C74646]">{highRiskCos.length} pending</span>
          </div>

          <div className="flex-1 divide-y divide-[#EBF0F7]">
            {highRiskCos.slice(0, 5).map(c => (
              <div
                key={c.id}
                onClick={() => { selectCompany(c.id); navigate("/risk") }}
                className="px-4 py-3 cursor-pointer hover:bg-[#EAF2FF] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[#172033] leading-tight">{c.name}</span>
                  <span className={`shrink-0 ${c.riskLevel === "critical" ? "badge-critical" : "badge-high"}`}>
                    {c.riskLevel === "critical" ? "Critical" : "High"} Risk
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[12px] text-[#5F6F85]">{c.loanExposure} requested</span>
                  <span className="text-[11px] font-semibold text-[#C74646]">Review required →</span>
                </div>
              </div>
            ))}
            {highRiskCos.length === 0 && (
              <div className="px-4 py-8 text-center text-[12px] text-[#5F6F85]">
                No pending reviews at this time.
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[#D9E1EA]">
            <button
              onClick={() => navigate("/companies")}
              className="text-[12px] font-semibold text-[#1E4FA3] hover:text-[#123B78] flex items-center gap-1"
            >
              View all portfolio companies <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Audit Log + Sector Exposure ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Recent Credit Actions — banking table */}
        <div className="lg:col-span-7 bank-panel">
          <div className="bank-panel-header">
            <div>
              <h2 className="bank-h3">Recent Credit Actions</h2>
              <p className="text-[11px] text-[#5F6F85] mt-0.5">Audit log of assessments and officer decisions</p>
            </div>
            <span className="text-[11px] text-[#5F6F85]">Audit trail</span>
          </div>
          <div className="overflow-x-auto">
            <table className="bank-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Action</th>
                  <th>Officer</th>
                  <th>Time</th>
                  <th className="text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditEvents.map(ev => (
                  <tr key={ev.id}>
                    <td className="font-semibold">{ev.company}</td>
                    <td className="text-[#5F6F85]">{ev.action}</td>
                    <td className="text-[#5F6F85]">{ev.officer}</td>
                    <td className="text-[#5F6F85]">{ev.time}</td>
                    <td className="text-right pr-4">
                      <span className={ev.isWarning ? "badge-pending" : "badge-done"}>
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Exposure */}
        <div className="lg:col-span-5 bank-panel">
          <div className="bank-panel-header">
            <div>
              <h2 className="bank-h3">Sector Exposure</h2>
              <p className="text-[11px] text-[#5F6F85] mt-0.5">Exposure concentration by industry</p>
            </div>
            <span className="text-[11px] text-[#5F6F85]">{Object.keys(sectorData).length} sectors</span>
          </div>
          <div className="p-4 space-y-3">
            {Object.entries(sectorData).map(([sector, s]) => {
              const pct = totalExposure > 0 ? Math.round((s.exposure / totalExposure) * 100) : 0
              const formattedExp = s.exposure >= 1000
                ? `₹${(s.exposure / 1000).toFixed(1)}B`
                : `₹${s.exposure.toFixed(0)}M`
              return (
                <div key={sector} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-[#172033]">{sector}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#172033] mono">{formattedExp}</span>
                      <span className="text-[11px] text-[#5F6F85] w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded bg-[#EBF0F7] overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${pct}%`, background: "#1E4FA3" }}
                    />
                  </div>
                  <div className="text-[11px] text-[#5F6F85]">
                    {s.count} {s.count === 1 ? "company" : "companies"}
                  </div>
                </div>
              )
            })}
            {Object.keys(sectorData).length === 0 && (
              <p className="text-[12px] text-[#5F6F85] py-6 text-center">Loading portfolio data...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
