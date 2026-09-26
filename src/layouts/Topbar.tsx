import { Bell, HelpCircle, ChevronDown } from "lucide-react"
import { useCompaniesStore } from "@/stores/companiesStore"
import { useAuthStore } from "@/stores/authStore"

const riskBadgeCls = (level: string) => {
  switch (level) {
    case "low":      return "badge-low"
    case "medium":   return "badge-medium"
    case "high":     return "badge-high"
    case "critical": return "badge-critical"
    default:         return "badge-pending"
  }
}

const riskLabel = (level: string) => {
  const map: Record<string, string> = {
    low: "Low Risk", medium: "Medium Risk", high: "High Risk", critical: "Critical Risk"
  }
  return map[level] ?? level
}

export function Topbar() {
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()
  const { user } = useAuthStore()

  const displayName = user?.name || "Thomas Shelby"
  const displayRole = user?.role === "Corporate Credit Officer"
    ? "Senior Credit Officer"
    : user?.role || "Senior Credit Officer"
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase()
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0]

  return (
    <header
      className="flex h-14 w-full items-center justify-between bg-white print:hidden select-none"
      style={{ borderBottom: "1px solid #D9E1EA" }}
    >
      {/* ── Left: Entity Context ── */}
      <div className="flex items-center gap-0 min-w-0 h-full divide-x divide-[#D9E1EA]">

        {/* Active Company Selector */}
        <div className="flex items-center gap-1.5 h-full px-4 cursor-pointer hover:bg-[#F5F7FA] transition-colors group relative">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#5F6F85] leading-none mb-0.5">Active Entity</div>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedCompanyId}
                onChange={e => selectCompany(Number(e.target.value))}
                className="text-sm font-semibold text-[#172033] focus:outline-none cursor-pointer appearance-none bg-transparent max-w-[200px] truncate"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-[#5F6F85] shrink-0 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sector */}
        {activeCompany && (
          <div className="hidden sm:flex items-center h-full px-4">
            <div>
              <div className="text-[11px] font-medium text-[#5F6F85] leading-none mb-0.5">Sector</div>
              <div className="text-sm font-medium text-[#172033]">{activeCompany.sector}</div>
            </div>
          </div>
        )}

        {/* Risk Status */}
        {activeCompany && (
          <div className="hidden md:flex items-center h-full px-4">
            <div>
              <div className="text-[11px] font-medium text-[#5F6F85] leading-none mb-0.5">Risk Status</div>
              <span className={riskBadgeCls(activeCompany.riskLevel)}>
                {riskLabel(activeCompany.riskLevel)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Actions & User ── */}
      <div className="flex items-center h-full divide-x divide-[#D9E1EA]">

        {/* Help */}
        <button
          className="hidden sm:flex h-full px-3 items-center text-[#5F6F85] hover:text-[#1E4FA3] hover:bg-[#F5F7FA] transition-colors"
          title="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          className="h-full px-3 flex items-center text-[#5F6F85] hover:text-[#1E4FA3] hover:bg-[#F5F7FA] transition-colors relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-3 right-2.5 h-1.5 w-1.5 rounded-full bg-[#C74646]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 h-full px-4 hover:bg-[#F5F7FA] cursor-pointer transition-colors">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "#1E4FA3" }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-[#172033] leading-none">{displayName}</div>
            <div className="text-[11px] text-[#5F6F85] leading-none mt-0.5">{displayRole}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
