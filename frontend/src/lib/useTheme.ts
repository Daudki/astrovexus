import { useSyncExternalStore } from "react"
import { getTheme, setTheme, subscribe, type Theme } from "@/lib/theme"

export function useTheme(): [Theme, (t: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme)
  return [theme, setTheme]
}
