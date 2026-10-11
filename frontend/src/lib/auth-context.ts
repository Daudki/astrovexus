import { createContext, useContext } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  mustChangePassword: boolean
}

export interface AuthState {
  user: User | null
  /** True while a saved session is being checked. */
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  /** Used after a password change, which returns a fresh token. */
  setSession: (token: string, user: User) => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
