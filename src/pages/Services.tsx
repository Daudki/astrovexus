import { BentoGrid, BentoItem } from "@/components/ui"
import { CTA } from "@/components/CTA"
import { services, process } from "@/content"
import { Code, Palette, Sparkles, GraduationCap } from "lucide-react"
import type { ComponentType } from "react"

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Code,
  Palette,
  Sparkles,
  GraduationCap,
}

export default function Services() {
  return (
    <>
      <section className="wrap pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          Services
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink max-w-4xl leading-[1.05]">
          What we do for clients.
        </h1>
        <p className="mt-6 text-black/60 text-lg max-w-2xl leading-relaxed">
          Small projects, big projects, and the in-between ones. Every engagement starts with a conversation and a written scope.
        </p>
      </section>

      <section className="wrap pb-16 md:pb-24">
        <BentoGrid className="grid-cols-1 md:grid-cols-2">
          {services.map((s) => {
            const Icon = ICONS[s.icon]
            return (
              <BentoItem
                key={s.key}
                header={
                  <div className="flex w-full min-h-[4rem] rounded-xl bg-gradient-to-br from-royal/10 via-lilac/30 to-royal/5 items-center justify-center">
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

      <div className="bg-light/50">
        <section className="wrap py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
            How we work
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
            Four steps. Same on every project.
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {process.map((p) => (
              <div key={p.step}>
                <div className="font-mono text-xs text-royal mb-4">{p.step}</div>
                <h3 className="font-display font-bold text-lg text-ink mb-2">{p.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CTA />
    </>
  )
}
