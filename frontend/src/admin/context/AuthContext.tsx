import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Designer' | 'Developer' | 'Sales' | 'Support'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const AUTH_TOKEN_KEY = 'agency_auth_token'
const AUTH_USER_KEY = 'agency_user'
const AUTH_EXPIRED_KEY = 'agency_auth_expired'

const rolePermissions: Record<string, string[]> = {
  Admin: ['all'],
  Manager: ['leads', 'clients', 'projects', 'portfolio', 'services', 'pricing', 'testimonials', 'messages', 'proposals', 'invoices', 'tasks', 'support', 'blog', 'analytics', 'media', 'team', 'settings'],
  Designer: ['portfolio', 'services', 'media', 'projects'],
  Developer: ['projects', 'services', 'portfolio', 'analytics', 'media'],
  Sales: ['leads', 'clients', 'proposals', 'invoices'],
  Support: ['support', 'messages', 'tasks'],
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Unable to refresh session')
    }

    const payload = (await response.json()) as { accessToken: string; user: User }
    localStorage.setItem(AUTH_TOKEN_KEY, payload.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user))
    setUser(payload.user)
    return payload.accessToken
  }

  useEffect(() => {
    const bootstrapAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const savedUser = localStorage.getItem(AUTH_USER_KEY)

      if (!savedToken) {
        setIsLoading(false)
        return
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User)
        } catch {
          localStorage.removeItem(AUTH_USER_KEY)
        }
      }

      try {
        let accessToken = savedToken
        let response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        })

        if (response.status === 401) {
          accessToken = await refreshSession()
          response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
          })
        }

        if (!response.ok) {
          throw new Error('Session expired')
        }

        const payload = (await response.json()) as { user: User }
        setUser(payload.user)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user))
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
        localStorage.setItem(AUTH_EXPIRED_KEY, '1')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setIsLoading(false)
        return false
      }

      const payload = (await response.json()) as { accessToken: string; user: User }
      localStorage.setItem(AUTH_TOKEN_KEY, payload.accessToken)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user))
      localStorage.removeItem(AUTH_EXPIRED_KEY)
      setUser(payload.user)
      setIsLoading(false)
      return true
    } catch {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    void fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  const isAuthenticated = !!user

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    const permissions = rolePermissions[user.role] || []
    return permissions.includes('all') || permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}