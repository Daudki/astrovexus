import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { studio } from "@/content"
import { ShimmerButton, TextGenerate } from "@/components/ui"

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-white">
      {/* Aurora layers */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-royal/25 blur-[130px] animate-aurora-slow" />
        <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full bg-lilac/60 blur-[130px] animate-aurora-slower" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-navy/15 blur-[130px] animate-aurora-slow" />
      </div>

      <div className="relative wrap py-20 md:py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-xs font-mono text-black/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse" />
            New studio · {studio.place}
          </div>

          <h1 className="font-display font-extrabold text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-ink">
            <TextGenerate words="A new studio in Mbeya. Building real software." />
          </h1>

          <p className="mt-8 text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            {studio.blurb}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/contact" className="w-full sm:w-auto">
              <ShimmerButton className="w-full sm:w-auto">
                Work with us <ArrowUpRight size={16} />
              </ShimmerButton>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-7 rounded-full border border-black/10 text-ink font-medium hover:border-black/30 transition-colors"
            >
              Meet the founders
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
