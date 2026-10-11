import { InsightCard } from "@/components/InsightCard"
import { useFeed } from "@/lib/useFeed"
import { usePageTitle } from "@/lib/usePageTitle"

export default function Insights() {
  usePageTitle("Insights | AstroVexus")
  const feed = useFeed()

  return (
    <>
      <section className="wrap pt-20 pb-10 md:pt-28 md:pb-12">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">Insights</div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink max-w-3xl leading-[1.05]">
          Notes from the studio.
        </h1>
        <p className="mt-6 text-black/60 text-lg max-w-2xl leading-relaxed">
          Short, honest posts on building software and brands in Tanzania, what we're learning, and what we're trying next.
        </p>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <div className="max-w-2xl divide-y divide-black/10 border-t border-black/10">
          {feed.loading && <p className="py-10 text-black/50">Loading insights...</p>}

          {!feed.loading && feed.error && (
            <div className="py-10">
              <p className="text-red-700">{feed.error}</p>
              <button type="button" onClick={feed.retry} className="mt-3 text-royal hover:underline">
                Try again
              </button>
            </div>
          )}

          {!feed.loading && !feed.error && feed.items.length === 0 && (
            <p className="py-10 text-black/50">Nothing posted yet. Check back soon.</p>
          )}

          {feed.items.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
        </div>

        {feed.hasMore && (
          <button
            type="button"
            onClick={feed.loadMore}
            disabled={feed.loadingMore}
            className="mt-8 h-11 px-6 rounded-full border border-black/15 text-ink hover:border-black/40 transition-colors disabled:opacity-60"
          >
            {feed.loadingMore ? "Loading..." : "Load more"}
          </button>
        )}
      </section>
    </>
  )
}
