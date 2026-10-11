import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { api } from "@/lib/api"
import { initials, MAX_POST_LENGTH, type Insight } from "@/lib/insights"

interface Props {
  authorName: string
  onPosted: (item: Insight) => void
}

/** A social-style box: write, see how many characters are left, post. */
export function Composer({ authorName, onPosted }: Props) {
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_POST_LENGTH - text.length
  const empty = text.trim().length === 0

  const grow = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (busy || empty || remaining < 0) return
    setBusy(true)
    setError("")
    try {
      const r = await api<{ item: Insight }>("/api/insights", { method: "POST", body: { body: text }, auth: true })
      onPosted(r.item)
      setText("")
      requestAnimationFrame(grow)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-3 sm:gap-4 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
      <div className="size-10 sm:size-11 shrink-0 rounded-full bg-ink text-white grid place-items-center text-sm font-medium" aria-hidden="true">
        {initials(authorName)}
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor="composer" className="sr-only">Write an insight</label>
        <textarea
          id="composer"
          ref={ref}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            grow()
          }}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder="What did you learn or notice today?"
          className="w-full resize-none bg-transparent text-[15px] sm:text-base text-ink placeholder:text-black/35 focus:outline-none leading-relaxed"
        />
        {error && <div role="alert" className="mt-2 text-sm text-red-700">{error}</div>}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/10 pt-3">
          <span className={`font-mono text-xs ${remaining < 0 ? "text-red-700" : remaining < 100 ? "text-amber-700" : "text-black/40"}`}>
            {remaining}
          </span>
          <button
            type="submit"
            disabled={busy || empty || remaining < 0}
            className="h-10 px-6 rounded-full bg-ink text-white text-sm font-medium hover:bg-royal transition-colors disabled:opacity-40 disabled:hover:bg-ink"
          >
            {busy ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  )
}
