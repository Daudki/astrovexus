export interface Insight {
  id: string
  body: string
  createdAt: string
  updatedAt: string | null
  author: { id: string; name: string }
}

export const MAX_POST_LENGTH = 2000

export function timeAgo(iso: string, now = Date.now()) {
  const then = new Date(iso)
  const s = Math.max(0, Math.floor((now - then.getTime()) / 1000))
  if (s < 60) return "now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  const sameYear = then.getFullYear() === new Date(now).getFullYear()
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) })
}

export const fullDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "?"

export type Token = { type: "text" | "url" | "tag"; value: string }

const PATTERN = /(https?:\/\/[^\s]+|#[\p{L}\p{N}_]+)/gu

/** Splits a post into plain text, links and #hashtags. Nothing is ever rendered as HTML. */
export function tokenize(body: string): Token[] {
  const out: Token[] = []
  let last = 0
  for (const match of body.matchAll(PATTERN)) {
    const start = match.index ?? 0
    const value = match[0]
    if (start > last) out.push({ type: "text", value: body.slice(last, start) })

    if (value.startsWith("#")) {
      out.push({ type: "tag", value })
    } else {
      // Keep sentence punctuation out of the link.
      const trimmed = value.replace(/[.,!?;:)\]]+$/, "")
      out.push({ type: "url", value: trimmed })
      if (trimmed.length < match[0].length) out.push({ type: "text", value: match[0].slice(trimmed.length) })
    }
    last = start + match[0].length
  }
  if (last < body.length) out.push({ type: "text", value: body.slice(last) })
  return out
}
