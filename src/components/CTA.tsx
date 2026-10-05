import { Link } from "react-router-dom"
import { ArrowUpRight, Phone } from "lucide-react"
import { MovingBorderButton } from "@/components/ui"
import { studio } from "@/content"

export function CTA() {
  return (
    <section className="bg-royal text-white relative overflow-hidden">
      <div className="wrap py-16 sm:py-20 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl leading-tight">
            Ready to be our first real client?
          </h2>

          <p className="mt-6 text-white/80 text-lg leading-relaxed">
            We're not pretending to have a portfolio. We are two people who can
            build what you need, and who will treat your project like it matters.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/contact" className="inline-flex">
              <MovingBorderButton>
                Start a project <ArrowUpRight size={16} />
              </MovingBorderButton>
            </Link>

            <a
              href={`tel:${studio.phoneHref}`}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-white/30 text-white font-medium hover:border-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              <Phone size={15} className="mr-2" />
              {studio.phone}
            </a>
          </div>

          <div className="mt-8 text-sm text-white/60">
            Or email us directly at{" "}
            <a
              href={`mailto:${studio.email}`}
              className="text-white underline decoration-white/30 hover:decoration-white transition-colors"
            >
              {studio.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
