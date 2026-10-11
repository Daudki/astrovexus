import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Insight } from "@/lib/insights"

interface Page {
  items: Insight[]
  nextCursor: string | null
}

interface State {
  key: string
  items: Insight[]
  next: string | null
  error: string | null
}

/** Loads the insights feed page by page. Pass an author id to see just one person's posts. */
export function useFeed(authorId?: string) {
  const [reload, setReload] = useState(0)
  const [state, setState] = useState<State | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const key = `${authorId ?? "all"}:${reload}`

  useEffect(() => {
    let cancelled = false
    const qs = new URLSearchParams({ limit: "15" })
    if (authorId) qs.set("author", authorId)
    api<Page>(`/api/insights?${qs}`)
      .then((r) => {
        if (!cancelled) setState({ key, items: r.items, next: r.nextCursor, error: null })
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ key, items: [], next: null, error: e.message })
      })
    return () => {
      cancelled = true
    }
  }, [key, authorId])

  const current = state?.key === key ? state : null

  const loadMore = useCallback(async () => {
    if (!current?.next || loadingMore) return
    setLoadingMore(true)
    try {
      const qs = new URLSearchParams({ limit: "15", cursor: current.next })
      if (authorId) qs.set("author", authorId)
      const r = await api<Page>(`/api/insights?${qs}`)
      setState((s) => {
        if (!s || s.key !== key) return s
        const seen = new Set(s.items.map((i) => i.id))
        return { ...s, items: [...s.items, ...r.items.filter((i) => !seen.has(i.id))], next: r.nextCursor }
      })
    } catch (e) {
      setState((s) => (s && s.key === key ? { ...s, error: (e as Error).message } : s))
    } finally {
      setLoadingMore(false)
    }
  }, [current?.next, loadingMore, authorId, key])

  const update = useCallback(
    (fn: (items: Insight[]) => Insight[]) =>
      setState((s) => (s && s.key === key ? { ...s, items: fn(s.items) } : s)),
    [key],
  )

  return {
    items: current?.items ?? [],
    loading: current === null,
    error: current?.error ?? null,
    hasMore: Boolean(current?.next),
    loadingMore,
    loadMore,
    retry: () => setReload((n) => n + 1),
    prepend: (item: Insight) => update((items) => [item, ...items]),
    replace: (item: Insight) => update((items) => items.map((i) => (i.id === item.id ? item : i))),
    remove: (id: string) => update((items) => items.filter((i) => i.id !== id)),
  }
}
