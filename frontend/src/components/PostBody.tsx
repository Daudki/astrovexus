import { tokenize } from "@/lib/insights"

/** Plain text with links and #hashtags highlighted. Line breaks are kept. */
export function PostBody({ body, className = "" }: { body: string; className?: string }) {
  return (
    <p className={`whitespace-pre-wrap break-words leading-relaxed text-ink ${className}`}>
      {tokenize(body).map((t, i) => {
        if (t.type === "url") {
          return (
            <a key={i} href={t.value} target="_blank" rel="noopener noreferrer nofollow" className="text-royal hover:underline break-all">
              {t.value}
            </a>
          )
        }
        if (t.type === "tag") return <span key={i} className="text-royal">{t.value}</span>
        return <span key={i}>{t.value}</span>
      })}
    </p>
  )
}
