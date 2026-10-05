import { Founders } from "@/components/Founders"
import { CTA } from "@/components/CTA"
import { Marquee } from "@/components/ui"
import { values, verticals } from "@/content"

export default function About() {
  return (
    <>
      <section className="wrap pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          About
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink max-w-4xl leading-[1.05]">
          Two people in Mbeya. One studio, starting from zero.
        </h1>
        <p className="mt-6 text-black/60 text-lg max-w-2xl leading-relaxed">
          AstroVexus is new. We have no client portfolio to show you yet, and we are not going to invent one. What we have is two people with real skills, a clear plan, and enough nerve to build something here instead of waiting for somewhere else.
        </p>
      </section>

      <Founders />

      <div className="bg-light/50">
        <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
            How we operate
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
            Four things we hold to.
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="border-t border-black/10 pt-6">
                <h3 className="font-display font-bold text-lg text-ink mb-2">{v.title}</h3>
                <p className="text-black/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          Where we're going
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-6">
          Mbeya first. Then the rest of it.
        </h2>
        <p className="text-black/60 text-lg max-w-2xl leading-relaxed mb-10">
          We are starting with software, design, AI, and education tools. As the studio grows, these are the areas we plan to work in. Not promises — just the direction we're heading.
        </p>
        <div className="border-y border-black/5 py-8 overflow-hidden">
          <Marquee pauseOnHover duration="22s">
            {verticals.map((v) => (
              <span
                key={v}
                className="mx-3 px-4 py-2 rounded-full bg-white border border-black/10 font-mono text-xs text-black/70 whitespace-nowrap"
              >
                {v}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <CTA />
    </>
  )
}
