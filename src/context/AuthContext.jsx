import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState(() => localStorage.getItem('lastEmail') || '')

  const refreshSession = useCallback(async () => {
    try {
      await authApi.checkSession()
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const login = useCallback(async (emailInput, password) => {
    await authApi.login(emailInput, password)
    setIsAuthenticated(true)
    setEmail(emailInput)
    localStorage.setItem('lastEmail', emailInput)
  }, [])

  const register = useCallback(async (userName, emailInput, password) => {
    return authApi.register(userName, emailInput, password)
  }, [])

  // The backend has no logout endpoint yet (the "jwt" cookie is httpOnly,
  // so JS can't clear it directly). This clears local app state and sends
  // the user back to the login screen; the cookie expires on its own
  // shortly after. See README.md for the one-endpoint backend fix.
  const logout = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, checking, email, login, register, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
