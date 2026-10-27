import { api } from '@/lib/api'

export interface ActiveSession {
  id: string
  device: string
  browser: string
  ipAddress: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface LoginHistoryEntry {
  id: string
  timestamp: string
  ipAddress: string
  browser: string
  status: 'Success' | 'Failed'
  location: string
}

export interface SystemStatus {
  backend: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
  api: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
  aiEngine: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
  database: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
  cache: 'Running' | 'Offline' | 'Maintenance' | 'Unknown'
}

export const settingsService = {
  changePassword: async (current: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (!current || !newPass) {
      return { success: false, message: 'All password fields are required.' }
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' }
    }
    return { success: true, message: 'Password updated successfully!' }
  },

  getActiveSessions: async (): Promise<ActiveSession[]> => {
    return [
      {
        id: 'session_1',
        device: 'Windows PC',
        browser: 'Chrome 122.0',
        ipAddress: '192.168.1.144',
        location: 'Mumbai, India',
        lastActive: 'Active now',
        isCurrent: true,
      },
      {
        id: 'session_2',
        device: 'MacBook Pro',
        browser: 'Safari 17.2',
        ipAddress: '103.241.12.89',
        location: 'London, UK',
        lastActive: '2 hours ago',
        isCurrent: false,
      },
      {
        id: 'session_3',
        device: 'iPhone 15 Pro',
        browser: 'Mobile Safari',
        ipAddress: '172.56.21.9',
        location: 'New York, USA',
        lastActive: 'Yesterday',
        isCurrent: false,
      },
    ]
  },

  revokeSession: async (_sessionId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return true
  },

  signOutAllDevices: async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  },

  getLoginHistory: async (): Promise<LoginHistoryEntry[]> => {
    return [
      {
        id: 'lh_1',
        timestamp: '2026-07-24 18:50:22',
        ipAddress: '192.168.1.144',
        browser: 'Chrome (Windows)',
        status: 'Success',
        location: 'Mumbai, India',
      },
      {
        id: 'lh_2',
        timestamp: '2026-07-24 18:49:10',
        ipAddress: '192.168.1.144',
        browser: 'Chrome (Windows)',
        status: 'Failed',
        location: 'Mumbai, India',
      },
      {
        id: 'lh_3',
        timestamp: '2026-07-23 10:15:34',
        ipAddress: '103.241.12.89',
        browser: 'Safari (Mac)',
        status: 'Success',
        location: 'London, UK',
      },
      {
        id: 'lh_4',
        timestamp: '2026-07-22 14:02:11',
        ipAddress: '172.56.21.9',
        browser: 'Safari (iPhone)',
        status: 'Success',
        location: 'New York, USA',
      },
    ]
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    try {
      const res = await api.get('/health/health')
      const isOk = res.status === 200 && (res.data?.status === 'ok' || res.data?.status === 'ready')
      return {
        backend: isOk ? 'Running' : 'Offline',
        api: isOk ? 'Running' : 'Offline',
        aiEngine: 'Running',
        database: 'Running',
        cache: 'Running',
      }
    } catch {
      return {
        backend: 'Offline',
        api: 'Offline',
        aiEngine: 'Running',
        database: 'Running',
        cache: 'Running',
      }
    }
  },
}
