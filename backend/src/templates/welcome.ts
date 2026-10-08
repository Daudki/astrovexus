export type Lang = "en" | "sw"

const copy = {
  en: {
    subject: "You're on the AstroVexus list",
    greeting: (name?: string) => (name ? `Hi ${name},` : "Hi,"),
    lines: [
      "Thanks for signing up. You'll get our new posts and free resources (graphics templates and code snippets) when they're ready.",
      "We're a new studio in Mbeya, Tanzania, so we send rarely and only when we have something worth your time.",
      "Have a project in mind? Just reply to this email and tell us what you need.",
    ],
    signoff: "The AstroVexus team",
    unsub: "Don't want these emails? Reply with \"unsubscribe\" and we'll remove you.",
  },
  sw: {
    subject: "Umejiunga na orodha ya AstroVexus",
    greeting: (name?: string) => (name ? `Habari ${name},` : "Habari,"),
    lines: [
      "Asante kwa kujisajili. Utapokea makala zetu mpya na rasilimali za bure (violezo vya michoro na vipande vya msimbo) zikiwa tayari.",
      "Sisi ni studio mpya iliyopo Mbeya, Tanzania, kwa hiyo tunatuma barua pepe kwa nadra na pale tu tunapokuwa na kitu cha thamani kwako.",
      "Una mradi akilini? Jibu barua pepe hii tu na utuambie unachohitaji.",
    ],
    signoff: "Timu ya AstroVexus",
    unsub: "Hutaki barua pepe hizi? Jibu kwa neno \"unsubscribe\" nasi tutakuondoa.",
  },
} as const

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export function welcomeEmail(lang: Lang, name?: string) {
  const c = copy[lang]
  const safeName = name ? escapeHtml(name) : undefined

  const text = [c.greeting(name), "", ...c.lines.flatMap((l) => [l, ""]), c.signoff, "", c.unsub].join("\n")

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111;line-height:1.6">
  <p>${c.greeting(safeName)}</p>
  ${c.lines.map((l) => `<p>${l}</p>`).join("\n  ")}
  <p>${c.signoff}</p>
  <p style="color:#777;font-size:12px;margin-top:32px">${c.unsub}</p>
</div>`

  return { subject: c.subject, text, html }
}
