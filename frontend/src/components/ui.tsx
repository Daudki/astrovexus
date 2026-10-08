import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import type { ComponentProps, ReactNode } from "react"

/* ---------------- TextGenerate ---------------- */
export function TextGenerate({ words, className }: { words: string; className?: string }) {
  const list = words.split(" ")
  return (
    <span className={className}>
      {list.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ---------------- ShimmerButton ---------------- */
interface ShimmerButtonProps extends ComponentProps<"button"> {
  children: ReactNode
}
export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "relative overflow-hidden rounded-full bg-ink px-6 h-12 text-white font-medium isolate",
        className,
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span
        aria-hidden
        className="absolute inset-y-0 -left-1/2 w-1/2 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,199,255,0.55), transparent)",
        }}
      />
    </button>
  )
}

/* ---------------- MovingBorderButton ---------------- */
interface MovingBorderProps extends ComponentProps<"button"> {
  children: ReactNode
  containerClassName?: string
}
export function MovingBorderButton({
  children,
  className,
  containerClassName,
  ...props
}: MovingBorderProps) {
  return (
    <div
      className={cn(
        "relative inline-flex rounded-full p-[2px] overflow-hidden",
        containerClassName,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-[-100%] animate-spin-slow"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, #C9C7FF 60deg, #322CDE 120deg, transparent 180deg, transparent 360deg)",
        }}
      />
      <button
        {...props}
        className={cn(
          "relative rounded-full bg-white text-royal px-6 h-12 font-medium whitespace-nowrap",
          className,
        )}
      >
        <span className="flex items-center justify-center gap-2 whitespace-nowrap">
          {children}
        </span>
      </button>
    </div>
  )
}

/* ---------------- Marquee ---------------- */
interface MarqueeProps {
  children: ReactNode
  className?: string
  duration?: string
  pauseOnHover?: boolean
}
export function Marquee({
  children,
  className,
  duration = "30s",
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden",
        pauseOnHover && "marquee-pause",
        className,
      )}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div className="flex shrink-0 animate-marquee">
        <div className="flex">{children}</div>
      </div>
      <div className="flex shrink-0 animate-marquee" aria-hidden>
        <div className="flex">{children}</div>
      </div>
    </div>
  )
}

/* ---------------- BlurFade ---------------- */
interface BlurFadeProps {
  children: ReactNode
  className?: string
  delay?: number
}
export function BlurFade({ children, className, delay = 0 }: BlurFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Bento ---------------- */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("grid gap-4", className)}>{children}</div>
}

interface BentoItemProps {
  title: ReactNode
  description: ReactNode
  header?: ReactNode
  className?: string
}
export function BentoItem({ title, description, header, className }: BentoItemProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-black/8 bg-white p-6 flex flex-col gap-5 hover:border-royal/30 hover:shadow-[0_8px_40px_-12px_rgba(50,44,222,0.15)] transition-all",
        className,
      )}
    >
      {header}
      <div className="flex flex-col gap-2">
        <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
        <p className="text-black/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
