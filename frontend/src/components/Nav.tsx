import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { nav, studio } from "@/content"

export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="wrap flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/logo-mark.png" alt="" className="w-8 h-8" />
          <span className="font-display font-extrabold text-lg tracking-tight text-ink hidden xs:inline">
            {studio.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className={`text-sm ${
                pathname === n.href ? "text-royal font-medium" : "text-black/60 hover:text-black"
              } transition-colors`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-royal transition-colors"
          >
            Start a project
          </Link>
        </nav>

        <button
          className="md:hidden p-1 text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white px-6 py-6 space-y-5">
          {nav.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              onClick={() => setOpen(false)}
              className="block text-ink/80 hover:text-royal text-base"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-3 rounded-full bg-ink text-white font-medium"
          >
            Start a project
          </Link>
        </div>
      )}
    </header>
  )
}
