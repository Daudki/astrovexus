import { FormEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import { studio } from "@/content"

type FormStatus = "idle" | "submitting" | "success" | "error"

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [error, setError] = useState("")
  const [searchParams] = useSearchParams()
  const estimate = searchParams.get("estimate") ?? ""

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY

    if (!accessKey || accessKey === "your-access-key-here") {
      setError("The contact form is not configured yet. Please try again later.")
      setStatus("error")
      return
    }

    setStatus("submitting")
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    formData.append("access_key", accessKey)
    formData.append("subject", `New AstroVexus enquiry from ${formData.get("name")}`)
    formData.append("from_name", "AstroVexus Website")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong while sending your message.")
      }

      form.reset()
      setStatus("success")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while sending your message. Please try again."
      )
      setStatus("error")
    }
  }

  const isSubmitting = status === "submitting"

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
        {status === "success" ? (
          <div className="h-full flex items-center justify-center text-center py-16">
            <div>
              <div className="font-display font-bold text-2xl text-ink mb-2">
                Got it.
              </div>

              <p className="text-black/60">
                We'll get back to you as soon as we've read it properly.
              </p>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-medium text-royal hover:text-ink transition-colors"
              >
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2"
              >
                Your name
              </label>

              <input
                id="name"
                required
                name="name"
                autoComplete="name"
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                required
                type="email"
                name="email"
                autoComplete="email"
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2"
              >
                What's it about?
              </label>

              <select
                id="subject"
                name="subject"
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"
              >
                <option>A new project</option>
                <option>Working with us</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-mono text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2"
              >
                Message
              </label>

              <textarea
                id="message"
                required
                rows={5}
                name="message"
                defaultValue={estimate}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors resize-none disabled:opacity-60"
              />
            </div>

            {/* Web3Forms honeypot spam protection */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {status === "error" && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
