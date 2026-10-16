import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import type { Insight } from "@/lib/insights"
import { InsightCard } from "@/components/InsightCard"
import { usePageTitle } from "@/lib/usePageTitle"

type State = { id: string; item: Insight | null; error: string | null; notFound: boolean }

export default function InsightPost() {
  const { id = "" } = useParams()
  const [state, setState] = useState<State | null>(null)

  useEffect(() => {
    let cancelled = false
    api<{ item: Insight }>(`/api/insights/${encodeURIComponent(id)}`)
      .then((r) => !cancelled && setState({ id, item: r.item, error: null, notFound: false }))
      .catch((e: Error) => {
        if (cancelled) return
        const notFound = e instanceof ApiError && e.status === 404
        setState({ id, item: null, error: notFound ? null : e.message, notFound })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const current = state?.id === id ? state : null
  const item = current?.item ?? null
  usePageTitle(item ? `${item.author.name}: ${item.body.slice(0, 60) || "Photo"} | AstroVexus` : "Insight | AstroVexus")

  return (
    <section className="wrap pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="max-w-2xl">
        <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-royal">
          <ArrowLeft size={16} /> All insights
        </Link>

        <div className="mt-6 border-t border-black/10">
          {!current && <p className="py-10 text-black/50">Loading...</p>}
          {current?.notFound && <p className="py-10 text-black/60">This insight doesn't exist, or it was removed.</p>}
          {current?.error && <p className="py-10 text-red-700">{current.error}</p>}
          {item && <InsightCard item={item} large />}
        </div>
      </div>
    </section>
  )
}
