import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Loader } from "@/components/Loader"
import { useAuth } from "@/lib/auth-context"
import { usePageTitle } from "@/lib/usePageTitle"

const tab = ({ isActive }: { isActive: boolean }) =>
  `px-1 pb-3 text-sm border-b-2 transition-colors ${
    isActive ? "border-royal text-ink font-medium" : "border-transparent text-black/50 hover:text-black"
  }`

export default function AdminLayout() {
  usePageTitle("Admin | AstroVexus", { noindex: true })
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  if (user.mustChangePassword && location.pathname !== "/admin/account") {
    return <Navigate to="/admin/account" replace />
  }

  return (
    <section className="wrap pt-10 pb-20 md:pt-14 md:pb-28">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal">Admin</div>
            <div className="mt-1 text-ink font-medium">
              {user.name} <span className="text-black/40 font-normal">({user.role === "admin" ? "Admin" : "User"})</span>
            </div>
          </div>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-ink">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        {!user.mustChangePassword && (
          <nav className="mt-6 flex gap-6 border-b border-black/10" aria-label="Admin sections">
            <NavLink to="/admin" end className={tab}>Posts</NavLink>
            {user.role === "admin" && <NavLink to="/admin/users" className={tab}>People</NavLink>}
            <NavLink to="/admin/account" className={tab}>Account</NavLink>
          </nav>
        )}

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </section>
  )
}
