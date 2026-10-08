import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <section className="wrap py-32 md:py-40 min-h-[60vh] flex items-center">
      <div className="max-w-2xl">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          404 · Not found
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
          This page isn't here.
        </h1>
        <p className="text-black/60 text-lg leading-relaxed mb-10 max-w-md">
          The link you followed may be broken, or the page may have moved.
          Head back to the home page and start from there.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </section>
  )
}
