import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { api, tokenStore } from "@/lib/api"
import { AuthContext, type User } from "@/lib/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStore.get() !== null)

  // Restore a saved session.
  useEffect(() => {
    if (!tokenStore.get()) return
    let cancelled = false
    api<{ user: User }>("/api/auth/me", { auth: true })
      .then((r) => {
        if (!cancelled) setUser(r.user)
      })
      .catch(() => {
        /* a rejected token is cleared by the api helper; network errors keep it */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Any 401 from an authenticated call signs the user out.
  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener("astro:logout", onLogout)
    return () => window.removeEventListener("astro:logout", onLogout)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: { email, password } })
    tokenStore.set(r.token)
    setUser(r.user)
    return r.user
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const setSession = useCallback((token: string, next: User) => {
    tokenStore.set(token)
    setUser(next)
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout, setSession }), [user, loading, login, logout, setSession])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
