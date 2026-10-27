export type Theme = "light" | "dark" | "night"

export const THEMES: { id: Theme; label: string; hint: string }[] = [
  { id: "light", label: "Light", hint: "Bright and clean" },
  { id: "dark", label: "Dark", hint: "Easy on the eyes" },
  { id: "night", label: "Night", hint: "True black, softer text" },
]

const KEY = "astro_theme"

/** Colour of the phone's browser bar for each theme (light keeps the brand colour). */
const BAR_COLOR: Record<Theme, string> = { light: "#322CDE", dark: "#11131b", night: "#000000" }

const isTheme = (v: unknown): v is Theme => v === "light" || v === "dark" || v === "night"

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return isTheme(v) ? v : null
  } catch {
    return null
  }
}

const systemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"

function apply(theme: Theme) {
  const root = document.documentElement
  root.setAttribute("data-theme", theme)
  root.style.colorScheme = theme === "light" ? "light" : "dark"
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR_COLOR[theme])
}

const initial = (): Theme => {
  const fromPage = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null
  return isTheme(fromPage) ? fromPage : (stored() ?? systemTheme())
}

let current: Theme = initial()
const listeners = new Set<() => void>()

function set(theme: Theme) {
  if (theme === current) return
  current = theme
  apply(theme)
  listeners.forEach((l) => l())
}

export const getTheme = () => current

/** Picks a theme and remembers the choice on this device. */
export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage blocked: the choice just won't be remembered */
  }
  set(theme)
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== "undefined") {
  apply(current)
  // Follow the device's light/dark setting until the person picks a theme themselves.
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!stored()) set(systemTheme())
  })
  // Keep other open tabs in step.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) set(stored() ?? systemTheme())
  })
}
