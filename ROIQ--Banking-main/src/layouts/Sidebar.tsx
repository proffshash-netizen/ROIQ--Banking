import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Upload,
  LineChart,
  TrendingUp,
  ShieldAlert,
  Briefcase,
  FileText,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useUIStore } from "@/stores/uiStore"

const navigation = [
  { name: "Dashboard",           href: "/",              icon: LayoutDashboard },
  { name: "Companies",           href: "/companies",     icon: Building2 },
  { name: "Dataset Upload",      href: "/upload",        icon: Upload },
  { name: "Financial Analytics", href: "/analytics",     icon: LineChart },
  { name: "Forecasts",           href: "/forecasts",     icon: TrendingUp },
  { name: "Credit Risk",         href: "/risk",          icon: ShieldAlert },
  { name: "Loan Recommendation", href: "/recommendation",icon: Briefcase },
  { name: "Executive Report",    href: "/report",        icon: FileText },
  { name: "Analyst Insights",    href: "/insights",      icon: BarChart2 },
  { name: "Settings",            href: "/settings",      icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <aside
      className={cn(
        "flex flex-col h-full select-none transition-all duration-200 shrink-0",
        "bg-[#123B78] text-white",
        sidebarOpen ? "w-56" : "w-14"
      )}
      style={{ borderRight: "none" }}
    >
      {/* ── Brand Mark ── */}
      <div
        className={cn(
          "flex items-center h-14 px-3.5 border-b border-[#1a4d8f] shrink-0",
          sidebarOpen ? "gap-2.5" : "justify-center"
        )}
      >
        {/* ROIQ Logo mark */}
        <div className="h-8 w-8 rounded bg-[#1E4FA3] border border-[#2F6FD6]/50 flex items-center justify-center shrink-0">
          <span className="text-white font-extrabold text-sm tracking-tight">R</span>
        </div>

        {sidebarOpen && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm tracking-wider leading-none">ROIQ</div>
            <div className="text-[#8BAED4] text-[10px] font-medium mt-0.5 leading-none">Corporate Banking</div>
          </div>
        )}
      </div>

      {/* ── Navigation Items ── */}
      <nav className="flex-1 overflow-y-auto py-2 no-scrollbar">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              to={item.href}
              title={!sidebarOpen ? item.name : undefined}
              className={cn(
                "flex items-center px-3.5 py-2.5 mx-1.5 rounded transition-colors",
                "text-[13px] font-medium gap-2.5",
                isActive
                  ? "bg-[#1E4FA3] text-white border-l-[3px] border-[#5CA0F5] pl-[11px]"
                  : "text-[#A8C4E5] hover:bg-[#1a4d8f] hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "shrink-0",
                  sidebarOpen ? "h-4 w-4" : "h-[18px] w-[18px]",
                  isActive ? "text-[#7EC4FF]" : "text-[#8BAED4]"
                )}
              />
              {sidebarOpen && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Collapse Toggle + Footer ── */}
      <div className="border-t border-[#1a4d8f] shrink-0">
        {sidebarOpen && (
          <div className="px-3.5 py-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#8BAED4] font-medium">ROIQ v2.4</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#238B5B] inline-block" />
                <span className="text-[10px] text-[#8BAED4]">Systems online</span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#1a4d8f] text-[#8BAED4] hover:text-white transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-3 text-[#8BAED4] hover:text-white hover:bg-[#1a4d8f] transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
