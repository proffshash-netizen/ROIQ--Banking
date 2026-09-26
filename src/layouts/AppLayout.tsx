import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { useSettingsStore } from "@/stores/settingsStore"
import { useUIStore } from "@/stores/uiStore"

export function AppLayout() {
  const { theme, fontSize, density, sidebarMode } = useSettingsStore((state) => state.appearance)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)

  // Sync sidebar state from settings
  useEffect(() => {
    setSidebarOpen(sidebarMode === "expanded")
  }, [sidebarMode, setSidebarOpen])

  // Sync theme
  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (t: "light" | "dark" | "system") => {
      root.classList.remove("light", "dark")
      if (t === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.add(systemDark ? "dark" : "light")
      } else {
        root.classList.add(t)
      }
    }

    applyTheme(theme)

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyTheme("system")
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Sync font size
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("font-size-small", "font-size-medium", "font-size-large")
    root.classList.add(`font-size-${fontSize}`)
  }, [fontSize])

  return (
    <div className={`flex h-screen bg-background overflow-hidden print:h-auto print:overflow-visible print:bg-white density-${density}`}>
      <div className="print:hidden flex shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 print:block print:w-full">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto bg-background print:overflow-visible print:bg-white print:p-0">
          <div className="p-4 sm:p-6 lg:p-8 print:p-0 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
