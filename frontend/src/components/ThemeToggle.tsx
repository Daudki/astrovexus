import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Check, Moon, MoonStar, Sun } from "lucide-react"
import { THEMES, type Theme } from "@/lib/theme"
import { useTheme } from "@/lib/useTheme"

const ICON: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, night: MoonStar }

/** One icon in the header that opens a small menu: Light, Dark or Night. */
export function ThemeToggle({ align = "right" }: { align?: "left" | "right" }) {
  const [theme, setTheme] = useTheme()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const Current = ICON[theme]

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("touchstart", onDown)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("touchstart", onDown)
    }
  }, [open])

  // Put focus on the chosen theme when the menu opens.
  useEffect(() => {
    if (open) items.current[THEMES.findIndex((t) => t.id === theme)]?.focus()
  }, [open, theme])

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.current.findIndex((el) => el === document.activeElement)
    if (e.key === "Escape") {
      setOpen(false)
      root.current?.querySelector<HTMLButtonElement>("button[aria-haspopup]")?.focus()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      items.current[(i + 1) % THEMES.length]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      items.current[(i - 1 + THEMES.length) % THEMES.length]?.focus()
    }
  }

  return (
    <div ref={root} className="theme-toggle relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${THEMES.find((t) => t.id === theme)!.label}. Change theme`}
        className="grid size-10 place-items-center rounded-full text-ink hover:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
      >
        <Current size={20} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKey}
          className={`absolute top-full z-50 mt-2 w-56 rounded-xl border border-black/10 bg-white p-1.5 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}
        >
          {THEMES.map((t, i) => {
            const Icon = ICON[t.id]
            const selected = t.id === theme
            return (
              <button
                key={t.id}
                ref={(el) => {
                  items.current[i] = el
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-none"
              >
                <Icon size={18} className={selected ? "text-royal" : "text-black/60"} />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{t.label}</span>
                  <span className="block text-xs text-black/50">{t.hint}</span>
                </span>
                {selected && <Check size={16} className="text-royal" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
