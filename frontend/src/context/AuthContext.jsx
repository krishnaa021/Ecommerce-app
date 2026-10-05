import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // If a token is stored, stay in "loading" until /auth/me confirms it
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  // Restore the session on page load
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    let ignore = false

    getCurrentUser()
      .then((u) => {
        if (!ignore) setUser(u)
      })
      .catch(() => {
        // A 401 is already handled by the axios interceptor (token removed)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // The axios interceptor fires this when a token expires
  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const saveSession = useCallback(({ token, ...profile }) => {
    localStorage.setItem('token', token)
    setUser(profile)
    return profile
  }, [])

  const login = useCallback(
    async (credentials) => saveSession(await loginUser(credentials)),
    [saveSession]
  )

  const register = useCallback(
    async (details) => saveSession(await registerUser(details)),
    [saveSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAdmin: user?.role === 'admin', login, register, logout }),
    [user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}