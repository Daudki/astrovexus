import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check } from "lucide-react"
import { services } from "@/content"
import {
  pricing,
  timelines,
  estimate,
  formatTZS,
  formatUSD,
  formatRange,
  type ServiceKey,
} from "@/data/pricing"

const eyebrow = "font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-3"

const card = (active: boolean) =>
  `text-left rounded-lg border px-4 py-3 transition-colors ${
    active ? "border-royal bg-royal/5" : "border-black/10 bg-white hover:border-black/30"
  }`

const cols = (n: number) => (n % 3 === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2")

export default function Pricing() {
  const [serviceKey, setServiceKey] = useState<ServiceKey>("software")
  const [categoryId, setCategoryId] = useState(pricing[0].categories[0].id)
  const [packageId, setPackageId] = useState(pricing[0].categories[0].packages[0].id)
  const [addonIds, setAddonIds] = useState<string[]>([])
  const [timelineId, setTimelineId] = useState<(typeof timelines)[number]["id"]>("standard")
  const [usd, setUsd] = useState(false)

  const service = pricing.find((p) => p.key === serviceKey)!
  const serviceTitle = services.find((s) => s.key === serviceKey)!.title
  const category = service.categories.find((c) => c.id === categoryId) ?? service.categories[0]
  const packageOpt = category.packages.find((p) => p.id === packageId) ?? category.packages[0]
  const timeline = timelines.find((t) => t.id === timelineId)!
  const chosenAddons = category.addons.filter((a) => addonIds.includes(a.id))

  const showCategory = service.categories.length > 1
  const n = showCategory ? 1 : 0 // step offset when the category step is shown

  const range = estimate({ packageOpt, addons: chosenAddons, factor: timeline.factor })
  const fmt = (v: number) => (usd ? formatUSD(v) : formatTZS(v))

  const chooseService = (key: ServiceKey) => {
    const first = pricing.find((p) => p.key === key)!.categories[0]
    setServiceKey(key)
    setCategoryId(first.id)
    setPackageId(first.packages[0].id)
    setAddonIds([])
  }

  const chooseCategory = (id: string) => {
    const next = service.categories.find((c) => c.id === id)!
    setCategoryId(id)
    setPackageId(next.packages[0].id)
    setAddonIds([])
  }

  const toggleAddon = (id: string) =>
    setAddonIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const summary = [
    "Estimate from the pricing page",
    `Service: ${serviceTitle}`,
    ...(showCategory ? [`Category: ${category.label}`] : []),
    `Scope: ${packageOpt.label}`,
    `Add-ons: ${chosenAddons.length ? chosenAddons.map((a) => a.label).join(", ") : "none"}`,
    `Timeline: ${timeline.label}`,
    `Range: ${formatTZS(range.min)} to ${formatTZS(range.max)}`,
    "",
    "A bit more about the project:",
    "",
  ].join("\n")

  return (
    <>
      <section className="wrap pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">Pricing</div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink max-w-4xl leading-[1.05]">
          Get a ballpark in a minute.
        </h1>
        <p className="mt-6 text-black/60 text-lg max-w-2xl leading-relaxed">
          Pick what you need and see a realistic range. It's an estimate, not a quote. The final price comes in a written scope after we talk.
        </p>
      </section>

      <section className="wrap pb-20 md:pb-28 grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
        <div className="space-y-10">
          <div>
            <div className={eyebrow}>1. What do you need?</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <button key={s.key} type="button" onClick={() => chooseService(s.key)} className={card(s.key === serviceKey)} aria-pressed={s.key === serviceKey}>
                  <span className="font-medium text-ink">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {showCategory && (
            <div>
              <div className={eyebrow}>2. What kind of {serviceTitle.toLowerCase()}?</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.categories.map((c) => (
                  <button key={c.id} type="button" onClick={() => chooseCategory(c.id)} className={card(c.id === category.id)} aria-pressed={c.id === category.id}>
                    <span className="block font-medium text-ink">{c.label}</span>
                    {c.hint && <span className="block mt-1 text-sm text-black/50">{c.hint}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className={eyebrow}>{2 + n}. {showCategory ? "What exactly?" : "How big is it?"}</div>
            <div className={`grid ${cols(category.packages.length)} gap-3`}>
              {category.packages.map((p) => (
                <button key={p.id} type="button" onClick={() => setPackageId(p.id)} className={card(p.id === packageOpt.id)} aria-pressed={p.id === packageOpt.id}>
                  <span className="block font-medium text-ink">{p.label}</span>
                  {p.hint && <span className="block mt-1 text-sm text-black/50">{p.hint}</span>}
                  <span className="block mt-2 font-mono text-xs text-black/50">{formatRange(p.min, p.max, usd)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className={eyebrow}>{3 + n}. Anything extra?</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {category.addons.map((a) => {
                const on = addonIds.includes(a.id)
                return (
                  <button key={a.id} type="button" onClick={() => toggleAddon(a.id)} className={`${card(on)} flex items-start gap-3`} aria-pressed={on}>
                    <span className={`mt-0.5 grid place-items-center size-5 rounded border shrink-0 ${on ? "bg-royal border-royal text-white" : "border-black/20"}`}>
                      {on && <Check size={14} />}
                    </span>
                    <span>
                      <span className="block text-ink">{a.label}</span>
                      <span className="block mt-1 font-mono text-xs text-black/50">+ {formatRange(a.min, a.max, usd)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className={eyebrow}>{4 + n}. When do you need it?</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {timelines.map((t) => (
                <button key={t.id} type="button" onClick={() => setTimelineId(t.id)} className={card(t.id === timelineId)} aria-pressed={t.id === timelineId}>
                  <span className="block font-medium text-ink">{t.label}</span>
                  <span className="block mt-1 text-sm text-black/50">{t.hint}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-black/40">Prices on the options above are base ranges. Fast track adds 30% to the total.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-2xl border border-black/10 bg-white p-6" aria-live="polite">
          <div className="flex items-center justify-between">
            <div className={`${eyebrow} mb-0`}>Your estimate</div>
            <div className="inline-flex rounded-full border border-black/10 p-0.5 text-xs font-mono">
              {[false, true].map((u) => (
                <button key={String(u)} type="button" onClick={() => setUsd(u)} className={`px-3 py-1 rounded-full ${usd === u ? "bg-ink text-white" : "text-black/50"}`}>
                  {u ? "USD" : "TZS"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight">
            {fmt(range.min)}
            <span className="block text-black/40 text-lg font-medium">to {fmt(range.max)}</span>
          </div>

          <dl className="mt-5 space-y-1.5 text-sm text-black/60">
            <div><dt className="inline text-black/40">Service: </dt><dd className="inline">{serviceTitle}</dd></div>
            {showCategory && (
              <div><dt className="inline text-black/40">Category: </dt><dd className="inline">{category.label}</dd></div>
            )}
            <div><dt className="inline text-black/40">Scope: </dt><dd className="inline">{packageOpt.label}</dd></div>
            {chosenAddons.length > 0 && (
              <div><dt className="inline text-black/40">Extras: </dt><dd className="inline">{chosenAddons.map((a) => a.label).join(", ")}</dd></div>
            )}
            <div><dt className="inline text-black/40">Timeline: </dt><dd className="inline">{timeline.label}</dd></div>
          </dl>

          <Link
            to={`/contact?estimate=${encodeURIComponent(summary)}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 h-12 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors"
          >
            Get a written quote <ArrowRight size={16} />
          </Link>
          <p className="mt-3 text-xs text-black/40 leading-relaxed">
            Ranges depend on scope. Your selections are sent along with your message so we can reply faster.
          </p>
        </aside>
      </section>
    </>
  )
}
