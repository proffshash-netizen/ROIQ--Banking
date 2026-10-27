import { create } from 'zustand'

export type Role = 'Corporate Credit Officer' | 'Risk Manager' | 'Administrator' | 'Admin' | 'Analyst' | 'Viewer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const getInitialState = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      return { user, isAuthenticated: true, isLoading: false }
    } catch {
      // fallback
    }
  }
  return { user: null, isAuthenticated: false, isLoading: false }
}

const initial = getInitialState()

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,
  isLoading: initial.isLoading,
  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isAuthenticated: true, isLoading: false })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false, isLoading: false })
  }
}))
