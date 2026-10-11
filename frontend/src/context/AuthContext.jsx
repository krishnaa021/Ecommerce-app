import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, googleLoginUser, loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    let ignore = false

    getCurrentUser()
      .then((u) => {
        if (!ignore) setUser(u)
      })
      .catch(() => {
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

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

  const googleLogin = useCallback(
    async (idToken) => saveSession(await googleLoginUser(idToken)),
    [saveSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      login,
      register,
      googleLogin,
      logout,
    }),
    [user, loading, login, register, googleLogin, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}