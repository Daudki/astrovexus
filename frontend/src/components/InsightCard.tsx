import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { fullDate, initials, timeAgo, type Insight } from "@/lib/insights"
import { PostBody } from "@/components/PostBody"

export function InsightCard({ item, actions, large = false }: { item: Insight; actions?: ReactNode; large?: boolean }) {
  return (
    <article className="flex gap-3 sm:gap-4 py-5">
      <div className="size-10 sm:size-11 shrink-0 rounded-full bg-ink text-white grid place-items-center text-sm font-medium" aria-hidden="true">
        {initials(item.author.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold text-ink">{item.author.name}</span>
          <Link to={`/insights/${item.id}`} title={fullDate(item.createdAt)} className="text-black/45 hover:text-royal">
            {timeAgo(item.createdAt)}
          </Link>
          {item.updatedAt && <span className="text-black/35" title={fullDate(item.updatedAt)}>edited</span>}
        </div>
        <PostBody body={item.body} className={`mt-1 ${large ? "text-lg sm:text-xl" : "text-[15px] sm:text-base"}`} />
        {actions && <div className="mt-3 flex items-center gap-4 text-sm text-black/50">{actions}</div>}
      </div>
    </article>
  )
}
