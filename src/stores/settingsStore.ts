import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GeneralSettings {
  language: string
  timeZone: string
  dateFormat: string
  currencyFormat: string
  autoSave: boolean
  defaultLandingPage: string
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  sidebarMode: 'expanded' | 'collapsed'
  fontSize: 'small' | 'medium' | 'large'
  density: 'compact' | 'comfortable'
}

export interface NotificationSettings {
  emailAlerts: boolean
  inAppNotifications: boolean
  loanDecisionAlerts: boolean
  weeklyReports: boolean
  securityAlerts: boolean
  aiProcessingNotifications: boolean
}

export interface PrivacySecuritySettings {
  twoFactor: boolean
  sessionTimeout: number // in minutes
  rememberDevice: boolean
}

export interface ReportSettings {
  exportFormat: 'pdf' | 'csv' | 'excel'
  autoReportNaming: boolean
  watermark: boolean
  downloadQuality: 'low' | 'medium' | 'high'
  autoDownloadFolder: string
}

interface SettingsState {
  general: GeneralSettings
  appearance: AppearanceSettings
  notifications: NotificationSettings
  privacySecurity: PrivacySecuritySettings
  reports: ReportSettings
  
  updateGeneral: (updates: Partial<GeneralSettings>) => void
  updateAppearance: (updates: Partial<AppearanceSettings>) => void
  updateNotifications: (updates: Partial<NotificationSettings>) => void
  updatePrivacySecurity: (updates: Partial<PrivacySecuritySettings>) => void
  updateReports: (updates: Partial<ReportSettings>) => void
  resetSettings: () => void
}

const defaultSettings = {
  general: {
    language: 'en',
    timeZone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    currencyFormat: 'USD',
    autoSave: true,
    defaultLandingPage: 'dashboard',
  },
  appearance: {
    theme: 'dark' as const,
    sidebarMode: 'expanded' as const,
    fontSize: 'medium' as const,
    density: 'comfortable' as const,
  },
  notifications: {
    emailAlerts: true,
    inAppNotifications: true,
    loanDecisionAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
    aiProcessingNotifications: true,
  },
  privacySecurity: {
    twoFactor: false,
    sessionTimeout: 30,
    rememberDevice: true,
  },
  reports: {
    exportFormat: 'pdf' as const,
    autoReportNaming: true,
    watermark: true,
    downloadQuality: 'high' as const,
    autoDownloadFolder: 'C:\\Users\\shash\\Downloads\\Banking_Sys Data',
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateGeneral: (updates) =>
        set((state) => ({ general: { ...state.general, ...updates } })),
      updateAppearance: (updates) =>
        set((state) => ({ appearance: { ...state.appearance, ...updates } })),
      updateNotifications: (updates) =>
        set((state) => ({ notifications: { ...state.notifications, ...updates } })),
      updatePrivacySecurity: (updates) =>
        set((state) => ({ privacySecurity: { ...state.privacySecurity, ...updates } })),
      updateReports: (updates) =>
        set((state) => ({ reports: { ...state.reports, ...updates } })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'roiq-settings-store',
    }
  )
)
