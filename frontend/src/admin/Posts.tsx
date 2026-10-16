import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { MAX_POST_LENGTH, type Insight } from "@/lib/insights"
import { useFeed } from "@/lib/useFeed"
import { Composer } from "@/components/Composer"
import { InsightCard } from "@/components/InsightCard"

function Editor({ item, onSaved, onCancel }: { item: Insight; onSaved: (i: Insight) => void; onCancel: () => void }) {
  const [text, setText] = useState(item.body)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const save = async () => {
    setBusy(true)
    setError("")
    try {
      const r = await api<{ item: Insight }>(`/api/insights/${item.id}`, { method: "PATCH", body: { body: text }, auth: true })
      onSaved(r.item)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="py-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        aria-label="Edit insight"
        className="w-full rounded-lg border border-black/15 bg-white p-3 text-[15px] sm:text-base text-ink leading-relaxed focus:border-royal focus:outline-none"
      />
      {error && <div role="alert" className="mt-2 text-sm text-red-700">{error}</div>}
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy || (!text.trim() && item.images.length === 0) || text.length > MAX_POST_LENGTH} className="h-9 px-5 rounded-full bg-ink text-white text-sm font-medium hover:bg-royal transition-colors disabled:opacity-40">
          {busy ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className="text-sm text-black/60 hover:text-ink">Cancel</button>
        <span className={`ml-auto font-mono text-xs ${text.length > MAX_POST_LENGTH ? "text-red-700" : "text-black/40"}`}>{MAX_POST_LENGTH - text.length}</span>
      </div>
    </div>
  )
}

export default function AdminPosts() {
  const { user } = useAuth()
  const isAdmin = user!.role === "admin"
  const [scope, setScope] = useState<"mine" | "all">("mine")
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState("")
  const feed = useFeed(scope === "mine" ? user!.id : undefined)

  const remove = async (item: Insight) => {
    if (!window.confirm("Delete this insight? This can't be undone.")) return
    setError("")
    try {
      await api(`/api/insights/${item.id}`, { method: "DELETE", auth: true })
      feed.remove(item.id)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div>
      <Composer authorName={user!.name} onPosted={(item) => feed.prepend(item)} />

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display font-extrabold text-xl text-ink">{scope === "mine" ? "Your posts" : "All posts"}</h2>
        {isAdmin && (
          <div className="inline-flex rounded-full border border-black/10 p-0.5 text-xs font-mono">
            {(["mine", "all"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setScope(s)} className={`px-3 py-1 rounded-full ${scope === s ? "bg-ink text-white" : "text-black/50"}`}>
                {s === "mine" ? "Mine" : "Everyone"}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-2 divide-y divide-black/10 border-t border-black/10">
        {feed.loading && <p className="py-8 text-black/50">Loading...</p>}
        {!feed.loading && feed.error && (
          <div className="py-8">
            <p className="text-red-700">{feed.error}</p>
            <button type="button" onClick={feed.retry} className="mt-2 text-royal hover:underline">Try again</button>
          </div>
        )}
        {!feed.loading && !feed.error && feed.items.length === 0 && (
          <p className="py-8 text-black/50">{scope === "mine" ? "You haven't posted yet. Write your first insight above." : "Nothing posted yet."}</p>
        )}

        {feed.items.map((item) => {
          const mine = item.author.id === user!.id
          if (editing === item.id) {
            return (
              <Editor
                key={item.id}
                item={item}
                onCancel={() => setEditing(null)}
                onSaved={(saved) => {
                  feed.replace(saved)
                  setEditing(null)
                }}
              />
            )
          }
          return (
            <InsightCard
              key={item.id}
              item={item}
              actions={
                <>
                  {mine && (
                    <button type="button" onClick={() => setEditing(item.id)} className="inline-flex items-center gap-1.5 hover:text-ink">
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                  {(mine || isAdmin) && (
                    <button type="button" onClick={() => remove(item)} className="inline-flex items-center gap-1.5 hover:text-red-700">
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </>
              }
            />
          )
        })}
      </div>

      {feed.hasMore && (
        <button type="button" onClick={feed.loadMore} disabled={feed.loadingMore} className="mt-6 h-10 px-5 rounded-full border border-black/15 text-sm text-ink hover:border-black/40 disabled:opacity-60">
          {feed.loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  )
}
