import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { faqs } from "@/content"

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
        FAQ
      </div>
      <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
        Questions people ask us.
      </h2>

      <div className="max-w-3xl divide-y divide-black/10 border-t border-black/10">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display font-bold text-lg text-ink">{f.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-royal transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="pb-6 text-black/60 leading-relaxed max-w-2xl">{f.a}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
