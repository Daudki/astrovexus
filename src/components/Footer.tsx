import { Link } from "react-router-dom"
import { nav, studio } from "@/content"

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="wrap py-16 md:py-20 grid gap-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <img src="/logo-mark.png" alt="" className="w-7 h-7 object-contain" />
            <span className="font-display font-extrabold text-white text-lg">
              {studio.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-white/60">
            Built in {studio.place}. Two founders, honest skills, real work.
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-5">
            Pages
          </div>
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link to={n.href} className="hover:text-white transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-5">
            Reach us
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${studio.email}`}
                className="hover:text-white transition-colors break-all"
              >
                {studio.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${studio.phoneHref}`}
                className="hover:text-white transition-colors"
              >
                {studio.phone}
              </a>
            </li>
            <li className="text-white/60">{studio.place}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="wrap py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} {studio.name}</span>
          <span>Built in Mbeya.</span>
        </div>
      </div>
    </footer>
  )
}
