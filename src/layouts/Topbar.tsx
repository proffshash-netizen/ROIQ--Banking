import { Bell, User, LayoutDashboard, Building2, Upload, LineChart, TrendingUp, ShieldAlert, Briefcase, FileText, Sparkles, Settings, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useCompaniesStore } from "@/stores/companiesStore"

const moduleLinks = [
  { name: "Dashboard",          href: "/",               icon: LayoutDashboard },
  { name: "Companies",          href: "/companies",      icon: Building2 },
  { name: "Upload",             href: "/upload",         icon: Upload },
  { name: "Financial Analytics",href: "/analytics",      icon: LineChart },
  { name: "Forecasts",          href: "/forecasts",      icon: TrendingUp },
  { name: "Credit Risk",        href: "/risk",           icon: ShieldAlert },
  { name: "Loan Recommendation",href: "/recommendation", icon: Briefcase },
  { name: "Executive Report",   href: "/report",         icon: FileText },
  { name: "AI Insights",        href: "/insights",       icon: Sparkles },
  { name: "Settings",           href: "/settings",       icon: Settings },
]

export function Topbar() {
  const { companies, selectedCompanyId, selectCompany } = useCompaniesStore()

  return (
    <div className="sticky top-0 z-30 flex flex-col border-b border-border bg-background shadow-sm print:hidden">
      {/* Main topbar row */}
      <header className="flex h-14 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch">
          
          {/* Active Entity Command & Context Dialog */}
          <div className="flex items-center justify-center flex-1 max-w-2xl mx-auto w-full">
            <div className="flex flex-1 items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-sm w-full transition-colors hover:bg-primary/15">
              <Building className="h-5 w-5 text-primary animate-pulse shrink-0" />
              <span className="text-muted-foreground font-semibold shrink-0">Active Entity:</span>
              <select
                value={selectedCompanyId}
                onChange={(e) => selectCompany(Number(e.target.value))}
                className="bg-transparent border-0 text-sm font-bold text-foreground focus:ring-0 focus:outline-none cursor-pointer w-full pr-4 py-0 appearance-none"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id} className="bg-card text-foreground">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden lg:flex lg:items-center text-sm font-semibold leading-6 text-foreground">
                Thomas Shelby (CCO)
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Module quick-access nav strip */}
      <nav
        className="flex items-center gap-1.5 overflow-x-auto px-4 sm:px-6 lg:px-8 py-2 bg-gradient-to-r from-card via-card/80 to-card border-t border-border/40 no-scrollbar"
        aria-label="Module navigation"
      >
        {moduleLinks.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground hover:border-border/50"
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
