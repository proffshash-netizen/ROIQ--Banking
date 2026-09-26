import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { useCompaniesStore } from "@/stores/companiesStore"
import { cn } from "@/lib/utils"

const riskBadgeCls = (level: string) => {
  switch (level) {
    case "low":      return "badge-low"
    case "medium":   return "badge-medium"
    case "high":     return "badge-high"
    case "critical": return "badge-critical"
    default:         return "badge-pending"
  }
}
const riskLabel: Record<string, string> = {
  low: "Low", medium: "Medium", high: "High", critical: "Critical"
}
const statusMeta: Record<string, { label: string; cls: string }> = {
  processing: { label: "Processing", cls: "badge-pending" },
  completed:  { label: "Completed",  cls: "badge-done" },
  flagged:    { label: "Flagged",    cls: "badge-high" },
  pending:    { label: "Queued",     cls: "badge-medium" },
}

export function Companies() {
  const navigate = useNavigate()
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "score" | "exposure">("name")
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = companies
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === "all" || c.riskLevel === riskFilter
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      return matchSearch && matchRisk && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "score") return (b.creditScore || 0) - (a.creditScore || 0)
      if (sortBy === "exposure") {
        const va = parseFloat(a.loanExposure.replace(/[^0-9.]/g, "")) || 0
        const vb = parseFloat(b.loanExposure.replace(/[^0-9.]/g, "")) || 0
        return vb - va
      }
      return 0
    })

  const highRiskCount = companies.filter(c => c.riskLevel === "high" || c.riskLevel === "critical").length
  const avgScore = companies.length
    ? (companies.reduce((s, c) => s + (c.creditScore || 68), 0) / companies.length).toFixed(1)
    : "68.1"

  const selectClass = "bank-input py-1.5 text-[13px] pr-7 h-8 appearance-none cursor-pointer"

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">

      {/* ── Breadcrumb ── */}
      <nav className="bank-breadcrumb">
        <span>Home</span>
        <ChevronRight className="h-3 w-3 text-[#A0AEBA]" />
        <span className="text-[#172033] font-medium">Companies</span>
      </nav>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="bank-h1">Companies</h1>
          <p className="bank-body mt-1">
            Institutional portfolio registry, debt commitments, and calibrated credit risk standing.
          </p>
        </div>
        <button
          onClick={() => navigate("/upload")}
          className="btn-primary shrink-0"
        >
          Add / Ingest Company
        </button>
      </div>

      {/* ── Portfolio Summary Strip ── */}
      <div className="bank-panel">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D9E1EA]">
          {[
            { label: "Total Counterparties", value: String(companies.length), accent: "#1E4FA3" },
            { label: "Avg. Credit Score",    value: `${avgScore} / 100`,      accent: "#238B5B" },
            { label: "High-Risk Flags",      value: String(highRiskCount),    accent: "#C74646" },
            { label: "Total Exposure",       value: "₹3.82B",                 accent: "#C98A16" },
          ].map(s => (
            <div key={s.label} className="p-4">
              <div className="text-[11px] font-semibold text-[#5F6F85] uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bank-panel p-3">
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5F6F85]" />
            <input
              className="bank-input pl-8 h-8 text-[13px]"
              placeholder="Search counterparty or sector…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select className={selectClass} value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
              <option value="all">All risk tiers</option>
              <option value="low">Low risk</option>
              <option value="medium">Medium risk</option>
              <option value="high">High risk</option>
              <option value="critical">Critical risk</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#5F6F85] pointer-events-none" />
          </div>
          <div className="relative">
            <select className={selectClass} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
              <option value="processing">Processing</option>
              <option value="pending">Queued</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#5F6F85] pointer-events-none" />
          </div>
          <div className="relative">
            <select className={selectClass} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="name">Sort: Name</option>
              <option value="score">Sort: Score</option>
              <option value="exposure">Sort: Exposure</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#5F6F85] pointer-events-none" />
          </div>
          <span className="text-[11px] text-[#5F6F85] ml-auto">{filtered.length} of {companies.length} records</span>
        </div>
      </div>

      {/* ── Corporate Credit Portfolio Table ── */}
      <div className="bank-panel overflow-hidden">
        <div className="bank-panel-header">
          <h2 className="bank-h3">Corporate Credit Portfolio</h2>
          <span className="text-[11px] text-[#5F6F85]">Click row to expand</span>
        </div>
        <div className="overflow-x-auto">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Total Debt</th>
                <th className="text-center">Risk Score</th>
                <th className="text-center">Risk Category</th>
                <th className="text-right">Exposure</th>
                <th className="text-center pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#5F6F85] text-[13px]">
                    No counterparties match the active filters.
                  </td>
                </tr>
              )}
              {filtered.map(c => {
                const badge = riskBadgeCls(c.riskLevel)
                const label = riskLabel[c.riskLevel] || c.riskLevel
                const stat = statusMeta[c.status] || { label: c.status, cls: "badge-pending" }
                const isSelected = selectedCompanyId === c.id
                const isOpen = expanded === c.id

                return (
                  <React.Fragment key={c.id}>
                    <tr
                      className={cn(
                        "cursor-pointer",
                        isSelected ? "bg-[#EAF2FF] border-l-2 border-l-[#1E4FA3]" : ""
                      )}
                      onClick={() => { selectCompany(c.id); setExpanded(isOpen ? null : c.id) }}
                    >
                      <td>
                        <div className="font-semibold text-[#172033]">{c.name}</div>
                        <div className="text-[11px] text-[#5F6F85]">{c.hq}</div>
                      </td>
                      <td className="text-[#5F6F85]">{c.sector}</td>
                      <td className="text-right font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{c.revenue}</td>
                      <td className="text-right text-[#5F6F85]" style={{ fontVariantNumeric: "tabular-nums" }}>{c.debt || "—"}</td>
                      <td className="text-center">
                        <span className={`font-bold ${c.creditScore >= 75 ? "text-[#238B5B]" : c.creditScore >= 55 ? "text-[#C98A16]" : "text-[#C74646]"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                          {c.creditScore}
                          <span className="text-[10px] text-[#5F6F85] font-normal ml-0.5">/ 100</span>
                        </span>
                      </td>
                      <td className="text-center"><span className={badge}>{label}</span></td>
                      <td className="text-right font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{c.loanExposure}</td>
                      <td className="text-center pr-4"><span className={stat.cls}>{stat.label}</span></td>
                    </tr>

                    {isOpen && (
                      <tr style={{ background: "#F0F6FF" }}>
                        <td colSpan={8} className="py-3 px-4 border-b border-[#D9E1EA]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                            <div className="flex flex-wrap gap-4 text-[#5F6F85]">
                              <span>CEO: <strong className="text-[#172033]">{c.ceo}</strong></span>
                              <span>Founded: <strong className="text-[#172033]">{c.founded}</strong></span>
                              <span>Employees: <strong className="text-[#172033]">{c.employees}</strong></span>
                              <span>EBITDA: <strong className="text-[#172033]">{c.ebitda || "—"}</strong></span>
                              <span>DSCR: <strong className="text-[#172033]">{c.dscr || "1.65x"}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="btn-primary text-xs py-1.5" onClick={e => { e.stopPropagation(); selectCompany(c.id); navigate("/risk") }}>
                                View Risk Assessment
                              </button>
                              <button className="btn-secondary text-xs py-1.5" onClick={e => { e.stopPropagation(); selectCompany(c.id); navigate("/report") }}>
                                Executive Report
                              </button>
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
      </div>
    </div>
  )
}

export default Companies
