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
  Sparkles,
  Settings,
  Menu
} from "lucide-react"
import { useUIStore } from "@/stores/uiStore"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Dataset Upload', href: '/upload', icon: Upload },
  { name: 'Financial Analytics', href: '/analytics', icon: LineChart },
  { name: 'Forecasts', href: '/forecasts', icon: TrendingUp },
  { name: 'Credit Risk', href: '/risk', icon: ShieldAlert },
  { name: 'Loan Recommendation', href: '/recommendation', icon: Briefcase },
  { name: 'Executive Report', href: '/report', icon: FileText },
  { name: 'AI Insights', href: '/insights', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300",
      sidebarOpen ? "w-52" : "w-14"
    )}>
      <div className="flex h-14 items-center justify-between px-3 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <div className="bg-primary/10 p-1 rounded-md flex items-center justify-center">
            <svg className="h-4 w-4 text-primary transform -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="6" />
              <line x1="21" y1="21" x2="14.5" y2="14.5" />
              <text x="7.5" y="13.5" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">$</text>
            </svg>
          </div>
          {sidebarOpen && (
            <span className="font-bold text-base tracking-tight">ROIQ</span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto h-7 w-7">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors relative overflow-hidden group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-md" />
                )}
                <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
