import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "./layouts/AppLayout"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Companies } from "./pages/Companies"

import { Forecast } from "./pages/Forecast"
import { Risk } from "./pages/Risk"
import { AIInsights } from "./pages/AIInsights"
import { Recommendation } from "./pages/Recommendation"
import { ExecutiveReport } from "./pages/ExecutiveReport"
import { Upload } from "./pages/Upload";
import { FinancialAnalyticsPage } from "./modules/financial-analytics/pages/FinancialAnalyticsPage";
import { Settings } from "./pages/Settings"
import { useAuthStore } from "./stores/authStore"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="upload" element={<Upload />} />
          <Route path="analytics" element={<FinancialAnalyticsPage />} />
          <Route path="forecasts" element={<Forecast />} />
          <Route path="risk" element={<Risk />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="report" element={<ExecutiveReport />} />
          <Route path="financial-analytics" element={<FinancialAnalyticsPage />} />
          <Route path="settings" element={<Settings />} />
          
        <Route path="*" element={<div className="p-8 text-center text-muted-foreground">This page is under construction.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
