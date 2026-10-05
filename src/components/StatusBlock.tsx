const items = [
  {
    num: "01",
    title: "No finished client work yet",
    body: "AstroVexus is brand new. We are not going to dress up our first months as if we have a portfolio.",
  },
  {
    num: "02",
    title: "Two people, one standard",
    body: "A programmer and a designer. Every project gets both of us, directly, from start to finish.",
  },
  {
    num: "03",
    title: "First clients get our best",
    body: "If you hire us now, you get founders who are building their reputation — and it shows.",
  },
]

export function StatusBlock() {
  return (
    <section className="bg-light/50 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="wrap">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          Where we are
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
          We're just starting. Here's what that means.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.num} className="p-8 rounded-2xl bg-white border border-black/8">
              <div className="font-mono text-xs text-royal mb-4">{it.num}</div>
              <h3 className="font-display font-bold text-lg text-ink mb-2">{it.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
