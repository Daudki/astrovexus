import { BentoGrid, BentoItem } from "@/components/ui"
import { Code, Palette, Sparkles, GraduationCap } from "lucide-react"
import type { ComponentType } from "react"
import { services } from "@/content"

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Code,
  Palette,
  Sparkles,
  GraduationCap,
}

export function ServicesBento() {
  return (
    <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
        What we do
      </div>
      <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
        Four things. Done properly.
      </h2>

      <BentoGrid className="grid-cols-1 md:grid-cols-3">
        {services.map((s, i) => {
          const Icon = ICONS[s.icon]
          const wide = i === 0 || i === 3
          return (
            <BentoItem
              key={s.key}
              className={wide ? "md:col-span-2" : ""}
              header={
                <div className="flex w-full min-h-[4rem] md:min-h-[6rem] rounded-xl bg-gradient-to-br from-royal/10 via-lilac/30 to-royal/5 items-center justify-center">
                  <Icon size={36} className="text-royal/60" />
                </div>
              }
              title={s.title}
              description={s.body}
            />
          )
        })}
      </BentoGrid>
    </section>
  )
}
