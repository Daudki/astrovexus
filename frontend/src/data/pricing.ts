// PLACEHOLDER PRICES. Edit the numbers below to match what AstroVexus actually charges.
// All amounts are in TZS. Each option is a range: [min, max].

export type ServiceKey = "software" | "design" | "ai" | "edtech"

export interface Option {
  id: string
  label: string
  hint?: string
  min: number
  max: number
}

export interface ServicePricing {
  key: ServiceKey
  packages: Option[]
  addons: Option[]
}

/** TZS per 1 USD. Update occasionally. */
export const USD_RATE = 2600

export const timelines = [
  { id: "standard", label: "Standard", hint: "Normal schedule", factor: 1 },
  { id: "fast", label: "Fast track", hint: "Needed in under 2 weeks", factor: 1.3 },
] as const

export const pricing: ServicePricing[] = [
  {
    key: "software",
    packages: [
      { id: "landing", label: "Landing page", hint: "One page, one goal", min: 600_000, max: 1_200_000 },
      { id: "website", label: "Business website", hint: "Up to ~6 pages", min: 1_500_000, max: 3_000_000 },
      { id: "webapp", label: "Web app or dashboard", hint: "Logins, data, custom logic", min: 4_000_000, max: 9_000_000 },
    ],
    addons: [
      { id: "bilingual", label: "English + Kiswahili", min: 150_000, max: 400_000 },
      { id: "cms", label: "Blog or content management", min: 300_000, max: 800_000 },
      { id: "accounts", label: "User accounts and login", min: 500_000, max: 1_500_000 },
      { id: "payments", label: "Mobile money or card payments", min: 600_000, max: 1_800_000 },
    ],
  },
  {
    key: "design",
    packages: [
      { id: "logo", label: "Logo", hint: "Primary mark and variations", min: 250_000, max: 500_000 },
      { id: "identity", label: "Brand identity", hint: "Logo, colors, type, usage guide", min: 800_000, max: 1_800_000 },
      { id: "brand-social", label: "Identity + social templates", hint: "Everything above, ready to post", min: 1_200_000, max: 2_500_000 },
    ],
    addons: [
      { id: "stationery", label: "Business cards and stationery", min: 100_000, max: 300_000 },
      { id: "signage", label: "Signage or print layout", min: 150_000, max: 400_000 },
      { id: "guide", label: "Extended brand guidelines", min: 200_000, max: 500_000 },
    ],
  },
  {
    key: "ai",
    packages: [
      { id: "assistant", label: "AI assistant", hint: "Chat or Q&A on your own content", min: 2_000_000, max: 5_000_000 },
      { id: "automation", label: "Automation or classifier", hint: "Takes a repetitive task off your plate", min: 1_000_000, max: 3_000_000 },
      { id: "local-model", label: "Local model setup", hint: "Runs on your own hardware", min: 1_500_000, max: 3_500_000 },
    ],
    addons: [
      { id: "training", label: "Team handover session", min: 200_000, max: 500_000 },
      { id: "integration", label: "Connect to WhatsApp or email", min: 400_000, max: 1_200_000 },
      { id: "support", label: "1 month of support", min: 300_000, max: 800_000 },
    ],
  },
  {
    key: "edtech",
    packages: [
      { id: "half-day", label: "Half-day workshop", hint: "Up to 4 hours", min: 300_000, max: 600_000 },
      { id: "full-day", label: "Full-day workshop", hint: "Up to 8 hours", min: 500_000, max: 1_000_000 },
      { id: "school-tool", label: "Learning tool for a school", hint: "Custom web tool for a class or school", min: 3_000_000, max: 7_000_000 },
    ],
    addons: [
      { id: "materials", label: "Printed or digital materials", min: 100_000, max: 300_000 },
      { id: "followup", label: "Follow-up session", min: 200_000, max: 450_000 },
      { id: "travel", label: "Travel outside Mbeya", min: 150_000, max: 600_000 },
    ],
  },
]

const roundTo = (n: number, step: number) => Math.round(n / step) * step

export function estimate(opts: { packageOpt: Option; addons: Option[]; factor: number }) {
  const min = opts.packageOpt.min + opts.addons.reduce((s, a) => s + a.min, 0)
  const max = opts.packageOpt.max + opts.addons.reduce((s, a) => s + a.max, 0)
  return { min: roundTo(min * opts.factor, 10_000), max: roundTo(max * opts.factor, 10_000) }
}

export const formatTZS = (n: number) => `TZS ${n.toLocaleString("en-US")}`
export const formatUSD = (n: number) => `$${roundTo(n / USD_RATE, 10).toLocaleString("en-US")}`
