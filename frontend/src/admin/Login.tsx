import { useState, type FormEvent } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { usePageTitle } from "@/lib/usePageTitle"

const input =
  "w-full px-4 h-12 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"

export default function AdminLogin() {
  usePageTitle("Team sign in | AstroVexus", { noindex: true })
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to={from} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="wrap py-20 md:py-28">
      <div className="max-w-sm mx-auto">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">Team</div>
        <h1 className="font-display font-extrabold text-3xl text-ink">Sign in</h1>
        <p className="mt-3 text-black/60">For AstroVexus team members. Clients don't need an account.</p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input type="email" required autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className={input} />
          <input type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} className={input} />
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors disabled:opacity-60">
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  )
}
