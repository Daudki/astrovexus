import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { useAuth, type User } from "@/lib/auth-context"

const input =
  "w-full px-4 h-12 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"

export default function AdminAccount() {
  const { user, setSession } = useAuth()
  const navigate = useNavigate()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const forced = user!.mustChangePassword

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (next !== confirm) {
      setError("The new passwords don't match.")
      return
    }
    setBusy(true)
    try {
      const r = await api<{ token: string; user: User }>("/api/auth/change-password", {
        method: "POST",
        body: { currentPassword: current, newPassword: next },
        auth: true,
      })
      setSession(r.token, r.user)
      setCurrent("")
      setNext("")
      setConfirm("")
      if (forced) navigate("/admin", { replace: true })
      else setDone(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm">
      <h2 className="font-display font-extrabold text-xl text-ink">{forced ? "Choose your password" : "Change password"}</h2>
      {forced && (
        <p className="mt-2 text-black/60">
          You signed in with a temporary password. Choose your own to continue. Use at least 10 characters.
        </p>
      )}
      <p className="mt-2 text-sm text-black/50">Signed in as {user!.email}</p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="password" required autoComplete="current-password" placeholder={forced ? "Temporary password" : "Current password"} value={current} onChange={(e) => setCurrent(e.target.value)} disabled={busy} className={input} />
        <input type="password" required minLength={10} autoComplete="new-password" placeholder="New password (10+ characters)" value={next} onChange={(e) => setNext(e.target.value)} disabled={busy} className={input} />
        <input type="password" required minLength={10} autoComplete="new-password" placeholder="Repeat new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={busy} className={input} />
        {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {done && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Password changed.</div>}
        <button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors disabled:opacity-60">
          {busy ? "Saving..." : "Save password"}
        </button>
      </form>
    </div>
  )
}
