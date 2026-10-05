import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import { studio } from "@/content"

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section className="wrap pt-20 pb-24 md:pt-28 md:pb-32 grid gap-16 md:grid-cols-2">
      <div>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          Contact
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05]">
          Tell us what you're working on.
        </h1>
        <p className="mt-6 text-black/60 text-lg leading-relaxed max-w-md">
          A short note is fine. What you need, when you need it, and what your budget looks like if you have one. Since we're new, your first message probably gets a longer reply than usual.
        </p>

        <div className="mt-12 space-y-6">
          <div className="flex items-start gap-4">
            <Mail size={18} className="text-royal mt-1 shrink-0" />
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-1">
                Email
              </div>
              <a
                href={`mailto:${studio.email}`}
                className="text-ink hover:text-royal transition-colors break-all"
              >
                {studio.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone size={18} className="text-royal mt-1 shrink-0" />
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-1">
                Phone
              </div>
              <a
                href={`tel:${studio.phoneHref}`}
                className="text-ink hover:text-royal transition-colors"
              >
                {studio.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin size={18} className="text-royal mt-1 shrink-0" />
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-1">
                Where we are
              </div>
              <div className="text-ink">{studio.place}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-light/60 border border-black/5 p-8 md:p-10">
        {sent ? (
          <div className="h-full flex items-center justify-center text-center py-16">
            <div>
              <div className="font-display font-bold text-2xl text-ink mb-2">Got it.</div>
              <p className="text-black/60">We'll get back to you as soon as we've read it properly.</p>
            </div>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <div>
              <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2">
                Your name
              </label>
              <input
                required
                name="name"
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2">
                What's it about?
              </label>
              <select
                name="subject"
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors"
              >
                <option>A new project</option>
                <option>Working with us</option>
                <option>Something else</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                name="message"
                className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
