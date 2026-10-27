import React, { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Eye,
  Bell,
  Lock,
  FileBarChart,
  HelpCircle,
  Info,
  Server,
  Globe,
  Clock,
  AlertTriangle,
  Key,
  Shield,
  Smartphone,
  CheckCircle2,
  XCircle,
  HelpCircle as HelpIcon,
  MessageSquare,
  BookOpen,
  LifeBuoy,
  Sparkles,
  Database,
  Cpu,
  Layers,
  ChevronRight,
  LogOut,
  Trash2,
  RefreshCw,
  Sliders
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { settingsService } from '@/services/settings.service'
import type { ActiveSession, LoginHistoryEntry, SystemStatus } from '@/services/settings.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SettingsTab =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'reports'
  | 'help'
  | 'about'
  | 'system'

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const settings = useSettingsStore()

  // Local feedback states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Toast Component
  const ToastMessage = () => {
    if (!toast) return null
    return (
      <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 ${
        toast.type === 'success'
          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
          : 'bg-rose-950/90 text-rose-300 border-rose-800'
      }`}>
        {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            System Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure ROIQ AI preferences, integrations, security credentials, and system layouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              settings.resetSettings()
              showToast('Settings restored to defaults')
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Defaults
          </Button>
        </div>
      </div>

      <ToastMessage />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Navigation */}
        <div className="flex flex-col gap-1.5 lg:col-span-1 bg-card/40 border border-border/50 rounded-xl p-3 backdrop-blur-sm">
          <TabButton
            active={activeTab === 'general'}
            label="General"
            icon={Globe}
            onClick={() => setActiveTab('general')}
          />
          <TabButton
            active={activeTab === 'appearance'}
            label="Appearance"
            icon={Eye}
            onClick={() => setActiveTab('appearance')}
          />
          <TabButton
            active={activeTab === 'notifications'}
            label="Notifications"
            icon={Bell}
            onClick={() => setActiveTab('notifications')}
          />
          <TabButton
            active={activeTab === 'privacy'}
            label="Privacy & Security"
            icon={Lock}
            onClick={() => setActiveTab('privacy')}
          />
          <TabButton
            active={activeTab === 'reports'}
            label="Reports"
            icon={FileBarChart}
            onClick={() => setActiveTab('reports')}
          />
          <TabButton
            active={activeTab === 'help'}
            label="Help & Support"
            icon={HelpCircle}
            onClick={() => setActiveTab('help')}
          />
          <TabButton
            active={activeTab === 'about'}
            label="About ROIQ AI"
            icon={Info}
            onClick={() => setActiveTab('about')}
          />
          <TabButton
            active={activeTab === 'system'}
            label="System Status"
            icon={Server}
            onClick={() => setActiveTab('system')}
          />
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-3 min-h-[500px]">
          {activeTab === 'general' && <GeneralSettingsPanel settings={settings} showToast={showToast} />}
          {activeTab === 'appearance' && <AppearanceSettingsPanel settings={settings} showToast={showToast} />}
          {activeTab === 'notifications' && <NotificationsSettingsPanel settings={settings} showToast={showToast} />}
          {activeTab === 'privacy' && <PrivacySettingsPanel showToast={showToast} />}
          {activeTab === 'reports' && <ReportsSettingsPanel settings={settings} showToast={showToast} />}
          {activeTab === 'help' && <HelpSupportPanel />}
          {activeTab === 'about' && <AboutPanel />}
          {activeTab === 'system' && <SystemStatusPanel />}
        </div>
      </div>
    </div>
  )
}

/* Sidebar Tab Button Component */
interface TabButtonProps {
  active: boolean
  label: string
  icon: React.ComponentType<any>
  onClick: () => void
}

function TabButton({ active, label, icon: Icon, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
        <span>{label}</span>
      </div>
      <ChevronRight className={`h-4 w-4 opacity-50 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:opacity-100'}`} />
    </button>
  )
}

/* Toggle Switch Component */
interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <div className="space-y-0.5 pr-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

/* Select Control Component */
interface SelectProps {
  label: string
  description?: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function SelectControl({ label, description, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-border/40 last:border-0 gap-2">
      <div className="space-y-0.5">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/* Radio Card Group Component */
interface RadioCardProps<T> {
  label: string
  description?: string
  value: T
  options: { value: T; label: string; description?: string }[]
  onChange: (value: T) => void
}

function RadioCardGroup<T extends string>({ label, description, value, options, onChange }: RadioCardProps<T>) {
  return (
    <div className="space-y-3 py-4 border-b border-border/40 last:border-0">
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{opt.label}</span>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/50'}`}>
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </div>
              {opt.description && <p className="text-xs text-muted-foreground mt-1.5">{opt.description}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* 1. GENERAL SETTINGS PANEL */
function GeneralSettingsPanel({ settings, showToast }: { settings: any; showToast: any }) {
  const g = settings.general

  const handleUpdate = (key: string, val: any) => {
    settings.updateGeneral({ [key]: val })
    if (g.autoSave) {
      showToast(`General setting '${key}' auto-saved`)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          General Settings
        </CardTitle>
        <CardDescription>Configure localized formats, language preferences, and landing preferences.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/40">
        <SelectControl
          label="Preferred Language"
          description="System interface localization."
          value={g.language}
          onChange={(val) => handleUpdate('language', val)}
          options={[
            { value: 'en', label: 'English (US)' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'zh', label: '中文 (简体)' },
          ]}
        />
        <SelectControl
          label="Time Zone"
          description="Local datetime formatting baseline."
          value={g.timeZone}
          onChange={(val) => handleUpdate('timeZone', val)}
          options={[
            { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
            { value: 'EST', label: 'EST (Eastern Standard Time - GMT-5)' },
            { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
            { value: 'IST', label: 'IST (Indian Standard Time - GMT+5:30)' },
            { value: 'SST', label: 'SST (Singapore Standard Time - GMT+8)' },
          ]}
        />
        <SelectControl
          label="Date Format"
          description="Choose how timestamps are structured."
          value={g.dateFormat}
          onChange={(val) => handleUpdate('dateFormat', val)}
          options={[
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-07-24)' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 24/07/2026)' },
            { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY (e.g. 07-24-2026)' },
            { value: 'Month DD, YYYY', label: 'Month DD, YYYY (e.g. July 24, 2026)' },
          ]}
        />
        <SelectControl
          label="Currency Format"
          description="Default currency notation for reports."
          value={g.currencyFormat}
          onChange={(val) => handleUpdate('currencyFormat', val)}
          options={[
            { value: 'USD', label: 'USD ($) - US Dollar' },
            { value: 'EUR', label: 'EUR (€) - Euro' },
            { value: 'GBP', label: 'GBP (£) - British Pound' },
            { value: 'INR', label: 'INR (₹) - Indian Rupee' },
            { value: 'SGD', label: 'SGD (S$) - Singapore Dollar' },
          ]}
        />
        <SelectControl
          label="Default Landing Page"
          description="Initial screen displayed upon logging in."
          value={g.defaultLandingPage}
          onChange={(val) => handleUpdate('defaultLandingPage', val)}
          options={[
            { value: 'dashboard', label: 'Dashboard Overview' },
            { value: 'analytics', label: 'Financial Analytics' },
            { value: 'forecasts', label: 'Forecasts & Macro' },
            { value: 'report', label: 'Executive Reports' },
          ]}
        />
        <Switch
          label="Auto Save Changes"
          description="Save settings updates immediately without requiring manual confirmation."
          checked={g.autoSave}
          onChange={(val) => handleUpdate('autoSave', val)}
        />
      </CardContent>
    </Card>
  )
}

/* 2. APPEARANCE PANEL */
function AppearanceSettingsPanel({ settings, showToast }: { settings: any; showToast: any }) {
  const a = settings.appearance

  const handleUpdate = (key: string, val: any) => {
    settings.updateAppearance({ [key]: val })
    if (settings.general.autoSave) {
      showToast(`Appearance updated: ${key} = ${val}`)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          Appearance Settings
        </CardTitle>
        <CardDescription>Tailor the UI layout density, theme, and sizes to your workspace preference.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/40">
        <RadioCardGroup
          label="Interface Theme"
          description="Choose between Light, Dark or system environment preference."
          value={a.theme}
          onChange={(val) => handleUpdate('theme', val)}
          options={[
            { value: 'light', label: 'Light', description: 'Clean light background' },
            { value: 'dark', label: 'Dark', description: 'Enterprise dark mode' },
            { value: 'system', label: 'System Theme', description: 'Follow your OS settings' },
          ]}
        />

        <RadioCardGroup
          label="Sidebar Mode"
          description="Set the default layout configuration of the primary sidebar."
          value={a.sidebarMode}
          onChange={(val) => handleUpdate('sidebarMode', val)}
          options={[
            { value: 'expanded', label: 'Expanded', description: 'Text and icons visible' },
            { value: 'collapsed', label: 'Collapsed', description: 'Icon-only view' },
          ]}
        />

        <RadioCardGroup
          label="Dashboard Density"
          description="Controls spacing and padding in cards and dashboards."
          value={a.density}
          onChange={(val) => handleUpdate('density', val)}
          options={[
            { value: 'comfortable', label: 'Comfortable', description: 'Spacious padding' },
            { value: 'compact', label: 'Compact', description: 'High information density' },
          ]}
        />

        <RadioCardGroup
          label="Font Size"
          description="Scales typography size across the entire application interface."
          value={a.fontSize}
          onChange={(val) => handleUpdate('fontSize', val)}
          options={[
            { value: 'small', label: 'Small', description: '13px root scaling' },
            { value: 'medium', label: 'Medium', description: '15px standard scale' },
            { value: 'large', label: 'Large', description: '17px high readability' },
          ]}
        />
      </CardContent>
    </Card>
  )
}

/* 3. NOTIFICATIONS PANEL */
function NotificationsSettingsPanel({ settings, showToast }: { settings: any; showToast: any }) {
  const n = settings.notifications

  const handleUpdate = (key: string, val: any) => {
    settings.updateNotifications({ [key]: val })
    if (settings.general.autoSave) {
      showToast(`Notification switch: ${key} = ${val ? 'Enabled' : 'Disabled'}`)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Notification Channels & Alerts
        </CardTitle>
        <CardDescription>Customize when and how you receive alerts, recommendations, and status updates.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/40">
        <Switch
          label="Email Alerts"
          description="Receive consolidated digests, critical recommendations, and reports via email."
          checked={n.emailAlerts}
          onChange={(val) => handleUpdate('emailAlerts', val)}
        />
        <Switch
          label="In-App Notifications"
          description="Show alerts in the navigation topbar notification tray."
          checked={n.inAppNotifications}
          onChange={(val) => handleUpdate('inAppNotifications', val)}
        />
        <Switch
          label="AI Analysis Completed"
          description="Notify when background macroeconomic or credit risk forecasting completes."
          checked={n.aiProcessingNotifications}
          onChange={(val) => handleUpdate('aiProcessingNotifications', val)}
        />
        <Switch
          label="Loan Recommendation Alerts"
          description="High-priority alerts when a company recommendation shifts (e.g. Approved -> Review)."
          checked={n.loanDecisionAlerts}
          onChange={(val) => handleUpdate('loanDecisionAlerts', val)}
        />
        <Switch
          label="Weekly Executive Reports"
          description="Automated notification when the weekly compiled credit executive report is ready."
          checked={n.weeklyReports}
          onChange={(val) => handleUpdate('weeklyReports', val)}
        />
        <Switch
          label="Security Alerts"
          description="Get notified about login attempts from new devices or password change completions."
          checked={n.securityAlerts}
          onChange={(val) => handleUpdate('securityAlerts', val)}
        />
      </CardContent>
    </Card>
  )
}

/* 4. PRIVACY & SECURITY PANEL */
function PrivacySettingsPanel({ showToast }: { showToast: any }) {
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [rememberDevice, setRememberDevice] = useState(true)
  
  // Password change local state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  
  // Lists
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [history, setHistory] = useState<LoginHistoryEntry[]>([])

  useEffect(() => {
    settingsService.getActiveSessions().then(setSessions)
    settingsService.getLoginHistory().then(setHistory)
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setPasswordLoading(true)
    const res = await settingsService.changePassword(currentPassword, newPassword)
    setPasswordLoading(false)

    if (res.success) {
      showToast(res.message, 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordError(res.message)
    }
  }

  const handleRevokeSession = async (id: string) => {
    const success = await settingsService.revokeSession(id)
    if (success) {
      setSessions(prev => prev.filter(s => s.id !== id))
      showToast('Active session revoked successfully.')
    }
  }

  const handleSignOutAll = async () => {
    const success = await settingsService.signOutAllDevices()
    if (success) {
      setSessions(prev => prev.filter(s => s.isCurrent))
      showToast('Signed out of all other active sessions.')
    }
  }

  return (
    <div className="space-y-6">
      {/* 2FA and Basic Toggles */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage credentials, timeout limits, and Multi-Factor authentication.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/40">
          <Switch
            label="Two-Factor Authentication (2FA)"
            description="Secure your account using TOTP codes generated from authenticator apps (Google, Microsoft)."
            checked={twoFactor}
            onChange={(val) => {
              setTwoFactor(val)
              showToast(`2FA is now ${val ? 'Activated' : 'Deactivated'}`)
            }}
          />
          <Switch
            label="Remember Device"
            description="Extend login session lifespan on this device by saving securely hashed browser tags."
            checked={rememberDevice}
            onChange={setRememberDevice}
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-border/40 last:border-0 gap-2">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-foreground">Session Timeout</label>
              <p className="text-xs text-muted-foreground">Auto lock or logout inactivity timeout (minutes).</p>
            </div>
            <Input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-full md:w-32 bg-background border border-input text-foreground font-medium text-center"
              min={5}
              max={240}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password UI */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            Update Password
          </CardTitle>
          <CardDescription>Enter your current password followed by your chosen secure replacement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Current Password</label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">New Password</label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => confirmPassword && setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-border/60"
              />
            </div>

            {passwordError && (
              <p className="text-xs text-red-400 font-semibold">{passwordError}</p>
            )}

            <Button type="submit" disabled={passwordLoading} className="h-9">
              {passwordLoading ? 'Updating credentials...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              Active Sessions
            </CardTitle>
            <CardDescription>Browser sessions currently logged in with authorization tokens.</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={handleSignOutAll} disabled={sessions.length <= 1}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out Others
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border/40">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{sess.device}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{sess.browser}</span>
                  {sess.isCurrent && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      CURRENT SESSION
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  IP: {sess.ipAddress} • {sess.location} • Last active: {sess.lastActive}
                </p>
              </div>
              {!sess.isCurrent && (
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRevokeSession(sess.id)}>
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Login History */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Login History Log
          </CardTitle>
          <CardDescription>Recent account access attempts with matching authorization statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase text-muted-foreground font-semibold">
                  <th className="py-2.5">Date & Time</th>
                  <th className="py-2.5">IP Address</th>
                  <th className="py-2.5">Browser/System</th>
                  <th className="py-2.5">Location</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/10 transition-colors">
                    <td className="py-3 text-foreground font-medium">{log.timestamp}</td>
                    <td className="py-3">{log.ipAddress}</td>
                    <td className="py-3">{log.browser}</td>
                    <td className="py-3">{log.location}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        log.status === 'Success'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* 5. REPORTS PANEL */
function ReportsSettingsPanel({ settings, showToast }: { settings: any; showToast: any }) {
  const r = settings.reports

  const handleUpdate = (key: string, val: any) => {
    settings.updateReports({ [key]: val })
    if (settings.general.autoSave) {
      showToast(`Report updated: ${key} = ${val}`)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-muted-foreground" />
          Export & Reporting Layouts
        </CardTitle>
        <CardDescription>Default settings for compiling and exporting underwriting executive reports.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/40">
        <RadioCardGroup
          label="Default Export Format"
          description="Default file type selection for downloads."
          value={r.exportFormat}
          onChange={(val) => handleUpdate('exportFormat', val)}
          options={[
            { value: 'pdf', label: 'PDF Report', description: 'Clean printable layouts' },
            { value: 'csv', label: 'CSV Spreadsheet', description: 'Raw numerical data tables' },
            { value: 'excel', label: 'Excel (XLSX)', description: 'Formatted spreadsheet sheets' },
          ]}
        />
        <RadioCardGroup
          label="Render Resolution Quality"
          description="Resolution settings for compiled PDF diagrams and images."
          value={r.downloadQuality}
          onChange={(val) => handleUpdate('downloadQuality', val)}
          options={[
            { value: 'low', label: 'Draft', description: 'Fast render, small sizes' },
            { value: 'medium', label: 'Standard', description: 'Balanced compression' },
            { value: 'high', label: 'Retina Print', description: 'Ultra-high pixel maps' },
          ]}
        />
        <Switch
          label="Auto Report Naming"
          description="Automate file saving formats with timestamp suffixes (e.g. ExecutiveReport_ROIQ_20260724.pdf)."
          checked={r.autoReportNaming}
          onChange={(val) => handleUpdate('autoReportNaming', val)}
        />
        <Switch
          label="Include Security Watermark"
          description="Overlay an institution watermark with the active user's credentials on report backdrops."
          checked={r.watermark}
          onChange={(val) => handleUpdate('watermark', val)}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-border/40 last:border-0 gap-2">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-foreground">Auto Download Folder</label>
            <p className="text-xs text-muted-foreground">Desired saving directory (subject to browser permissions).</p>
          </div>
          <Input
            type="text"
            value={r.autoDownloadFolder}
            onChange={(e) => handleUpdate('autoDownloadFolder', e.target.value)}
            className="w-full md:w-80 bg-background border border-input text-foreground font-mono text-sm text-right"
          />
        </div>
      </CardContent>
    </Card>
  )
}

/* 6. HELP & SUPPORT PANEL */
function HelpSupportPanel() {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null)

  const supportCards = [
    {
      title: 'Documentation',
      description: 'Explore API endpoints, underwriting logic guides, and credit evaluation criteria.',
      icon: BookOpen,
      body: 'Welcome to the ROIQ AI Platform Guide. Our documentation details variables, API mappings, and credit underwriting framework specifications used in evaluating borrowers. For specific credit metrics calculations, refer to the Credit Risk model guidelines.'
    },
    {
      title: 'Frequently Asked Questions',
      description: 'Find instant answers to common questions about reports, risk models, and integrations.',
      icon: HelpIcon,
      body: 'FAQ Quick Links:\n1. How is Credit Risk score determined? (Calculated based on Altman Z-Score and macro variables).\n2. How to change loan decision status? (Submit recommendations through the credit committee workflow).\n3. Is user information synced securely? (All credentials use OAuth and JWT tokens).'
    },
    {
      title: 'Contact Support',
      description: 'Get direct help from our team regarding platform configurations or custom integrations.',
      icon: LifeBuoy,
      body: 'Corporate Customer Support Portal:\n- Help desk: support@roiq.ai\n- Support hotline: +1-800-ROIQ-CORP\n- Response window: SLA under 2 hours for Enterprise partners.'
    },
    {
      title: 'Report a Bug',
      description: 'Submit technical flaws, visual errors, or slow endpoint rendering details.',
      icon: AlertTriangle,
      body: 'Technical Issues Intake:\nPlease send issue details with console stack traces to devops@roiq.ai. Please include your device and browser specs to accelerate validation.'
    },
    {
      title: 'Submit Feedback',
      description: 'Suggest usability enhancements, new visual integrations, or dashboard layouts.',
      icon: MessageSquare,
      body: 'Feedback & Feature Requests:\nWe love hearing recommendations! Please share user interface ideas or requests with product@roiq.ai.'
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            Help Center & Support Desk
          </CardTitle>
          <CardDescription>Access resources, documentation guides, and direct assistance paths.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  onClick={() => setModalContent({ title: card.title, body: card.body })}
                  className="border border-border/50 bg-card/30 hover:border-border hover:bg-card/60 p-4 rounded-xl cursor-pointer transition-all flex gap-3 group"
                >
                  <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5.5 w-5.5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modern Modal for Help Content */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-muted-foreground hover:text-foreground font-medium text-xs px-2 py-1 bg-accent/40 rounded hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {modalContent.body}
              </p>
            </div>
            <div className="px-6 py-3.5 bg-accent/20 border-t border-border/60 flex justify-end">
              <Button size="sm" onClick={() => setModalContent(null)}>
                Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* 7. ABOUT PANEL */
function AboutPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            About ROIQ AI
          </CardTitle>
          <CardDescription>Platform overview, engineering frameworks, and version records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ROIQ AI is an intelligent enterprise platform designed to support corporate banking and venture capital institutions in making informed financial decisions. By combining financial analytics, macroeconomic intelligence, treasury management, credit risk assessment, and explainable artificial intelligence, the platform helps analysts evaluate corporate borrowers more efficiently while maintaining transparency and regulatory compliance. Rather than replacing human expertise, ROIQ AI acts as an intelligent decision-support system, providing actionable insights, structured recommendations, and comprehensive reporting to assist financial professionals throughout the lending lifecycle.
          </p>

          <div className="border border-border/60 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 border-b border-border/60 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
              <div>Metric / Spec</div>
              <div>Details</div>
            </div>
            <div className="divide-y divide-border/40 text-xs">
              <AboutRow label="Platform Version" value="v1.4.2" />
              <AboutRow label="Build Version" value="build_2026.07.24_stable" />
              <AboutRow label="Frontend Framework" value="React.js v19.2 (Vite, TS)" />
              <AboutRow label="Backend Framework" value="FastAPI v0.139 (Python 3.12)" />
              <AboutRow label="AI Framework" value="LangChain + PyTorch Underwriting Inference" />
              <AboutRow label="Visualization Library" value="Apache ECharts" />
              <AboutRow label="Last Updated" value="2026-07-24 19:00 UTC" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 px-4 py-3 hover:bg-accent/10 transition-colors">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="text-muted-foreground font-mono">{value}</div>
    </div>
  )
}

/* 8. SYSTEM STATUS PANEL */
function SystemStatusPanel() {
  const [statuses, setStatuses] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = () => {
    setLoading(true)
    settingsService.getSystemStatus().then((res) => {
      setStatuses(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !statuses) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>System Status Log</CardTitle>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Checking live statuses of microservices...</p>
        </CardContent>
      </Card>
    )
  }

  const renderStatusBadge = (status: 'Running' | 'Offline' | 'Maintenance' | 'Unknown') => {
    let classes = ''
    switch (status) {
      case 'Running':
        classes = 'bg-emerald-950 text-emerald-400 border-emerald-800'
        break
      case 'Offline':
        classes = 'bg-rose-950 text-rose-400 border-rose-800'
        break
      case 'Maintenance':
        classes = 'bg-purple-950 text-purple-400 border-purple-800'
        break
      default:
        classes = 'bg-muted text-muted-foreground border-border'
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${classes}`}>
        {status === 'Running' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
        {status}
      </span>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            System Microservices Status
          </CardTitle>
          <CardDescription>Real-time status updates of active services in the ROIQ architecture.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStatus}>
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard title="Core Backend" desc="FastAPI Python API microservice" status={statuses?.backend || 'Unknown'} icon={Cpu} badge={renderStatusBadge} />
          <StatusCard title="Database Endpoint" desc="PostgreSQL database pool connection" status={statuses?.database || 'Unknown'} icon={Database} badge={renderStatusBadge} />
          <StatusCard title="External API Gateway" desc="Macro and financial integrations" status={statuses?.api || 'Unknown'} icon={Layers} badge={renderStatusBadge} />
          <StatusCard title="AI Underwriting Engine" desc="PyTorch credit forecasting worker" status={statuses?.aiEngine || 'Unknown'} icon={Sparkles} badge={renderStatusBadge} />
          <StatusCard title="Redis Memory Cache" desc="Data dashboard cache store" status={statuses?.cache || 'Unknown'} icon={Sliders} badge={renderStatusBadge} />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatusCardProps {
  title: string
  desc: string
  status: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
  icon: React.ComponentType<any>
  badge: (status: any) => React.ReactNode
}

function StatusCard({ title, desc, status, icon: Icon, badge }: StatusCardProps) {
  return (
    <div className="border border-border/50 bg-card/20 p-4 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted p-2 rounded-lg border border-border shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div>{badge(status)}</div>
    </div>
  )
}
