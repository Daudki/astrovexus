import { FormEvent, useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { API_URL } from "@/lib/api"

type Status = "idle" | "submitting" | "success" | "error"

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [lang, setLang] = useState<"en" | "sw">("en")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus("submitting")
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name") || undefined,
          lang,
          website: data.get("website") || undefined, // honeypot
        }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || !result.ok) {
        throw new Error(result.message || "Something went wrong. Please try again.")
      }
      form.reset()
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const busy = status === "submitting"

  return (
    <section className="wrap py-16 sm:py-20 md:py-24">
      <div className="max-w-2xl">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
          Stay in the loop
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink leading-tight">
          New posts and free resources, straight to your inbox.
        </h2>
        <p className="mt-4 text-black/60 text-lg leading-relaxed">
          Graphics templates, code snippets, and what we're learning as a new studio. Rarely, and only when it's worth your time.
        </p>

        {status === "success" ? (
          <div
            role="status"
            className="mt-8 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800"
          >
            <Check size={18} className="mt-0.5 shrink-0" />
            <span>You're in. Check your inbox for a welcome email (and your spam folder, just in case).</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate={false}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name (optional)"
                autoComplete="given-name"
                maxLength={80}
                disabled={busy}
                className="sm:w-48 px-4 h-12 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                disabled={busy}
                className="flex-1 px-4 h-12 rounded-lg bg-white border border-black/10 text-ink focus:border-royal focus:outline-none transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {busy ? "Signing up..." : "Subscribe"} {!busy && <ArrowRight size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-black/60">
              <span>Language:</span>
              {(["en", "sw"] as const).map((l) => (
                <label key={l} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="lang"
                    checked={lang === l}
                    onChange={() => setLang(l)}
                    disabled={busy}
                    className="accent-[#322CDE]"
                  />
                  {l === "en" ? "English" : "Kiswahili"}
                </label>
              ))}
            </div>

            {/* Honeypot: hidden from people, bots fill it in */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {status === "error" && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
