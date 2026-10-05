import { Marquee } from "@/components/ui"
import { services } from "@/content"

export function ServiceMarquee() {
  return (
    <div className="border-y border-black/5 py-8 bg-white overflow-hidden">
      <Marquee pauseOnHover duration="28s">
        {services.map((s) => (
          <span
            key={s.key}
            className="mx-8 font-display font-bold text-2xl md:text-4xl text-ink/20 whitespace-nowrap"
          >
            {s.title}
            <span className="mx-8 text-royal">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
