import type { ReactNode } from "react"

interface Props {
  eyebrow?: string
  title?: string
  children: ReactNode
  className?: string
}

export function Section({ eyebrow, title, children, className = "" }: Props) {
  return (
    <section className={`wrap py-16 sm:py-20 md:py-24 lg:py-32 ${className}`}>
      {eyebrow && (
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          {eyebrow}
        </div>
      )}
      {title && (
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink max-w-3xl leading-tight mb-14">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
