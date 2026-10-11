import { useEffect, useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { Check, Copy } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Person {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  active: boolean
  mustChangePassword: boolean
  createdAt: string
  lastLoginAt: string | null
  postCount: number
}

interface Credential {
  name: string
  email: string
  password: string
}

const input =
  "w-full px-4 h-11 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "never"

function CredentialBox({ credential, onClose }: { credential: Credential; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(credential.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* the password is visible, so it can be copied by hand */
    }
  }

  return (
    <div role="status" className="rounded-2xl border border-royal/30 bg-royal/5 p-5">
      <div className="font-medium text-ink">Temporary password for {credential.name}</div>
      <div className="mt-1 text-sm text-black/60">{credential.email}</div>
      <div className="mt-3 flex items-center gap-3">
        <code className="rounded-lg bg-white border border-black/10 px-3 py-2 font-mono text-base text-ink select-all break-all">{credential.password}</code>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-sm text-royal hover:underline shrink-0">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3 text-sm text-black/60">
        This is shown once. Send it to them privately. They'll be asked to choose their own password when they first sign in at /admin/login.
      </p>
      <button type="button" onClick={onClose} className="mt-3 text-sm text-black/60 hover:text-ink">Done</button>
    </div>
  )
}

export default function AdminUsers() {
  const { user } = useAuth()
  const [people, setPeople] = useState<Person[] | null>(null)
  const [loadError, setLoadError] = useState("")
  const [error, setError] = useState("")
  const [credential, setCredential] = useState<Credential | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [busy, setBusy] = useState(false)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    api<{ users: Person[] }>("/api/admin/users", { auth: true })
      .then((r) => !cancelled && setPeople(r.users))
      .catch((e: Error) => !cancelled && setLoadError(e.message))
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  if (!isAdmin) return <Navigate to="/admin" replace />

  const add = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const r = await api<{ user: Person; temporaryPassword: string }>("/api/admin/users", {
        method: "POST",
        body: { name, email, role },
        auth: true,
      })
      setPeople((p) => [...(p ?? []), r.user])
      setCredential({ name: r.user.name, email: r.user.email, password: r.temporaryPassword })
      setName("")
      setEmail("")
      setRole("user")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const patch = async (p: Person, body: Partial<Pick<Person, "role" | "active">>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return
    setError("")
    try {
      const r = await api<{ user: Person }>(`/api/admin/users/${p.id}`, { method: "PATCH", body, auth: true })
      setPeople((list) => list?.map((x) => (x.id === p.id ? r.user : x)) ?? null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const reset = async (p: Person) => {
    if (!window.confirm(`Reset ${p.name}'s password? They'll be signed out and need the new temporary password.`)) return
    setError("")
    try {
      const r = await api<{ temporaryPassword: string }>(`/api/admin/users/${p.id}/reset-password`, { method: "POST", auth: true })
      setCredential({ name: p.name, email: p.email, password: r.temporaryPassword })
      setPeople((list) => list?.map((x) => (x.id === p.id ? { ...x, mustChangePassword: true } : x)) ?? null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display font-extrabold text-xl text-ink">Add a person</h2>
        <p className="mt-1 text-sm text-black/60">
          <strong className="font-medium text-ink">User</strong> can write and manage their own insights.{" "}
          <strong className="font-medium text-ink">Admin</strong> can also add people and remove any post.
        </p>
        <form onSubmit={add} className="mt-4 grid sm:grid-cols-[1fr_1fr_130px_auto] gap-3">
          <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} disabled={busy} className={input} aria-label="Name" />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className={input} aria-label="Email" />
          <select value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} disabled={busy} className={input} aria-label="Role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={busy} className="h-11 px-6 rounded-full bg-ink text-white text-sm font-medium hover:bg-royal transition-colors disabled:opacity-60">
            {busy ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {credential && <CredentialBox credential={credential} onClose={() => setCredential(null)} />}
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <h2 className="font-display font-extrabold text-xl text-ink">People</h2>
        <div className="mt-2 divide-y divide-black/10 border-t border-black/10">
          {!people && !loadError && <p className="py-8 text-black/50">Loading...</p>}
          {loadError && <p className="py-8 text-red-700">{loadError}</p>}
          {people?.map((p) => {
            const me = p.id === user!.id
            return (
              <div key={p.id} className="py-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-ink">{p.name}{me && <span className="text-black/40 font-normal"> (you)</span>}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.role === "admin" ? "bg-royal/10 text-royal" : "bg-black/5 text-black/60"}`}>
                    {p.role === "admin" ? "Admin" : "User"}
                  </span>
                  {!p.active && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">Disabled</span>}
                  {p.active && p.mustChangePassword && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Hasn't set a password yet</span>}
                </div>
                <div className="mt-0.5 text-sm text-black/50 break-all">{p.email}</div>
                <div className="mt-0.5 text-xs text-black/40">
                  {p.postCount} {p.postCount === 1 ? "post" : "posts"} · last sign-in {when(p.lastLoginAt)}
                </div>
                {!me && (
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <button type="button" className="text-royal hover:underline" onClick={() => patch(p, { role: p.role === "admin" ? "user" : "admin" }, `Make ${p.name} ${p.role === "admin" ? "a User" : "an Admin"}?`)}>
                      Make {p.role === "admin" ? "User" : "Admin"}
                    </button>
                    <button type="button" className="text-royal hover:underline" onClick={() => reset(p)}>Reset password</button>
                    <button type="button" className={p.active ? "text-red-700 hover:underline" : "text-royal hover:underline"} onClick={() => patch(p, { active: !p.active }, p.active ? `Disable ${p.name}? They won't be able to sign in. Their posts stay up.` : undefined)}>
                      {p.active ? "Disable" : "Enable"}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
