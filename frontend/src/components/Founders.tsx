import { founders } from "@/content"
import { BlurFade } from "@/components/ui"

export function Founders() {
  return (
    <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
        Who's behind this
      </div>
      <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
        The two of us.
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {founders.map((f, i) => (
          <BlurFade key={f.name} delay={i * 0.1}>
            <article className="rounded-3xl bg-light/60 border border-black/5 overflow-hidden">
              {/* Photo frame: portrait aspect, crop anchored to top so heads are never cut */}
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-royal/15 via-lilac/30 to-royal/10">
                {/* Initials fallback: always rendered, sits behind the image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-extrabold text-6xl md:text-7xl text-royal/30 select-none">
                    {f.initials}
                  </span>
                </div>

                {/* The photo. If it fails to load, this whole tag is removed and initials show. */}
                <img
                  src={f.photo}
                  alt={`Portrait of ${f.name}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.remove()
                  }}
                />
              </div>

              {/* Text panel */}
              <div className="p-8 md:p-10">
                <h3 className="font-display font-bold text-2xl text-ink">{f.name}</h3>

                <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-royal mt-2 mb-5">
                  {f.role}
                </div>

                <p className="text-black/65 leading-relaxed mb-6">{f.bio}</p>

                <ul className="flex flex-wrap gap-2">
                  {f.skills.map((s) => (
                    <li
                      key={s}
                      className="px-3 py-1 rounded-full bg-white border border-black/5 font-mono text-[11px] text-black/60"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
