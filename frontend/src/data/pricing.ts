// PLACEHOLDER PRICES. Edit the numbers below to match what AstroVexus actually charges.
// All amounts are in TZS. Each option is a range: [min, max].
//
// Structure: service > category > packages (pick one) + add-ons (pick any).
// A service with more than one category makes the page ask for the category first.
// A service with a single category skips that step.

export type ServiceKey = "software" | "design" | "ai" | "edtech"

export interface Option {
  id: string
  label: string
  hint?: string
  min: number
  max: number
}

export interface Category {
  id: string
  label: string
  hint?: string
  packages: Option[]
  addons: Option[]
}

export interface ServicePricing {
  key: ServiceKey
  categories: Category[]
}

/** TZS per 1 USD. Update occasionally. */
export const USD_RATE = 2600

export const timelines = [
  { id: "standard", label: "Standard", hint: "Normal schedule", factor: 1 },
  { id: "fast", label: "Fast track", hint: "Needed in under 2 weeks", factor: 1.3 },
] as const

export const pricing: ServicePricing[] = [
  // ---------------------------------------------------------------- SOFTWARE
  {
    key: "software",
    categories: [
      {
        id: "software",
        label: "Software and web",
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
    ],
  },

  // ------------------------------------------------------------------ DESIGN
  {
    key: "design",
    categories: [
      {
        id: "brand",
        label: "Brand identity",
        hint: "A logo and the system around it",
        packages: [
          { id: "logo", label: "Logo", hint: "Primary mark and variations", min: 250_000, max: 500_000 },
          { id: "identity", label: "Brand identity", hint: "Logo, colors, typography, usage guide", min: 800_000, max: 1_800_000 },
          { id: "full-brand", label: "Full brand package", hint: "Identity, stationery and social kit", min: 1_600_000, max: 3_200_000 },
          { id: "rebrand", label: "Rebrand", hint: "Audit, new identity and rollout plan", min: 1_500_000, max: 3_500_000 },
        ],
        addons: [
          { id: "guidelines", label: "Extended brand guidelines", min: 200_000, max: 500_000 },
          { id: "naming", label: "Name and tagline research", min: 150_000, max: 400_000 },
          { id: "stationery", label: "Business cards and letterhead", min: 100_000, max: 300_000 },
          { id: "logo-motion", label: "Logo animation", min: 150_000, max: 400_000 },
        ],
      },
      {
        id: "social",
        label: "Social media and digital",
        hint: "Posts, ads and channel graphics",
        packages: [
          { id: "template-pack", label: "Social template pack", hint: "10 editable templates", min: 250_000, max: 600_000 },
          { id: "monthly-content", label: "Monthly content", hint: "12 designed posts per month", min: 400_000, max: 900_000 },
          { id: "ad-set", label: "Ad creative set", hint: "5 formats for one campaign", min: 200_000, max: 500_000 },
          { id: "channel-kit", label: "Channel kit", hint: "Banner, avatar and thumbnails", min: 200_000, max: 450_000 },
        ],
        addons: [
          { id: "copy", label: "Captions and copywriting", min: 100_000, max: 300_000 },
          { id: "resize", label: "Extra sizes and formats", min: 50_000, max: 150_000 },
          { id: "scheduling", label: "Scheduling and posting", min: 150_000, max: 400_000 },
        ],
      },
      {
        id: "print",
        label: "Print and marketing",
        hint: "Flyers, brochures, menus and decks",
        packages: [
          { id: "flyer", label: "Flyer or poster", hint: "A single piece", min: 80_000, max: 250_000 },
          { id: "brochure", label: "Brochure or catalog", hint: "Up to 8 pages", min: 300_000, max: 800_000 },
          { id: "menu", label: "Menu design", hint: "Restaurant, cafe or bar", min: 150_000, max: 400_000 },
          { id: "company-profile", label: "Company profile or pitch deck", hint: "Up to 15 pages", min: 500_000, max: 1_400_000 },
          { id: "banner", label: "Banner or signage layout", hint: "Roll-up, billboard or shopfront", min: 100_000, max: 300_000 },
        ],
        addons: [
          { id: "print-ready", label: "Print-ready files and proofing", min: 50_000, max: 150_000 },
          { id: "sw-version", label: "Kiswahili version", min: 80_000, max: 250_000 },
          { id: "photo", label: "Photo sourcing or retouching", min: 100_000, max: 350_000 },
        ],
      },
      {
        id: "packaging",
        label: "Packaging and labels",
        hint: "Products ready for the shelf",
        packages: [
          { id: "label", label: "Product label", hint: "One product, one label", min: 200_000, max: 500_000 },
          { id: "pack", label: "Box or pouch packaging", hint: "Full pack design", min: 500_000, max: 1_400_000 },
          { id: "range", label: "Product range", hint: "Up to 5 variants", min: 1_200_000, max: 3_000_000 },
        ],
        addons: [
          { id: "mockups", label: "3D mockups", min: 100_000, max: 300_000 },
          { id: "dieline", label: "Printer dieline and spec sheet", min: 100_000, max: 300_000 },
          { id: "regulatory", label: "Ingredient and regulatory text layout", min: 80_000, max: 200_000 },
        ],
      },
      {
        id: "ui",
        label: "UI and app design",
        hint: "Screens for websites and apps",
        packages: [
          { id: "landing-ui", label: "Landing page design", hint: "One page, desktop and mobile", min: 400_000, max: 900_000 },
          { id: "site-ui", label: "Website design", hint: "Up to 6 pages", min: 1_000_000, max: 2_500_000 },
          { id: "app-ui", label: "Mobile app design", hint: "Up to 10 screens", min: 1_500_000, max: 4_000_000 },
          { id: "design-system", label: "Design system", hint: "Components, colors and type", min: 1_500_000, max: 3_500_000 },
        ],
        addons: [
          { id: "prototype", label: "Clickable prototype", min: 300_000, max: 800_000 },
          { id: "research", label: "User research and testing", min: 400_000, max: 1_000_000 },
          { id: "handoff", label: "Developer handoff files", min: 150_000, max: 400_000 },
        ],
      },
      {
        id: "illustration",
        label: "Illustration and motion",
        hint: "Custom artwork and short videos",
        packages: [
          { id: "icons", label: "Icon set", hint: "Up to 20 icons", min: 200_000, max: 600_000 },
          { id: "illustrations", label: "Illustration set", hint: "5 custom pieces", min: 400_000, max: 1_200_000 },
          { id: "infographic", label: "Infographic", hint: "One data-rich graphic", min: 150_000, max: 450_000 },
          { id: "explainer", label: "Explainer video", hint: "30 to 60 seconds", min: 800_000, max: 2_500_000 },
        ],
        addons: [
          { id: "voiceover", label: "Voiceover in English or Kiswahili", min: 100_000, max: 300_000 },
          { id: "music", label: "Licensed music", min: 50_000, max: 150_000 },
          { id: "subtitles", label: "Subtitles", min: 50_000, max: 150_000 },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------- AI
  {
    key: "ai",
    categories: [
      {
        id: "ai",
        label: "AI and automation",
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
    ],
  },

  // ------------------------------------------------------------------ EDTECH
  {
    key: "edtech",
    categories: [
      {
        id: "workshops",
        label: "Workshops and training",
        hint: "Live sessions for teams and groups",
        packages: [
          { id: "half-day", label: "Half-day workshop", hint: "Up to 4 hours", min: 300_000, max: 600_000 },
          { id: "full-day", label: "Full-day workshop", hint: "Up to 8 hours", min: 500_000, max: 1_000_000 },
          { id: "bootcamp", label: "3-day bootcamp", hint: "Hands-on, small group", min: 1_200_000, max: 2_800_000 },
          { id: "team-program", label: "Team training program", hint: "4 sessions over a month", min: 1_500_000, max: 3_500_000 },
        ],
        addons: [
          { id: "materials", label: "Printed or digital materials", min: 100_000, max: 300_000 },
          { id: "certificates", label: "Certificates of completion", min: 50_000, max: 150_000 },
          { id: "followup", label: "Follow-up session", min: 200_000, max: 450_000 },
          { id: "travel", label: "Travel outside Mbeya", min: 150_000, max: 600_000 },
        ],
      },
      {
        id: "school-tools",
        label: "School and classroom tools",
        hint: "Software for teachers, students and parents",
        packages: [
          { id: "class-tool", label: "Learning tool for a class", hint: "One focused classroom tool", min: 1_500_000, max: 3_500_000 },
          { id: "quiz", label: "Quiz and exam platform", hint: "Create, take and mark online", min: 2_500_000, max: 6_000_000 },
          { id: "portal", label: "School portal", hint: "Attendance, grades and parent view", min: 4_000_000, max: 10_000_000 },
          { id: "parent-comms", label: "Parent communication system", hint: "Notices and reports to parents", min: 1_500_000, max: 4_000_000 },
        ],
        addons: [
          { id: "sms", label: "SMS notifications", min: 300_000, max: 900_000 },
          { id: "bilingual", label: "English + Kiswahili", min: 150_000, max: 400_000 },
          { id: "migration", label: "Data migration from spreadsheets", min: 200_000, max: 600_000 },
          { id: "teacher-training", label: "Teacher training session", min: 200_000, max: 500_000 },
        ],
      },
      {
        id: "youth",
        label: "Youth coding and digital skills",
        hint: "Programs for students and young people",
        packages: [
          { id: "holiday-camp", label: "Holiday camp", hint: "5 days, one group", min: 800_000, max: 2_000_000 },
          { id: "club-term", label: "Coding club", hint: "One term of 8 weeks", min: 1_200_000, max: 3_000_000 },
          { id: "ict-pack", label: "School ICT curriculum pack", hint: "Lesson plans and activities", min: 1_000_000, max: 2_500_000 },
        ],
        addons: [
          { id: "kits", label: "Learning kits and handouts", min: 100_000, max: 400_000 },
          { id: "showcase", label: "End of term showcase day", min: 150_000, max: 450_000 },
          { id: "parent-session", label: "Parent information session", min: 100_000, max: 250_000 },
        ],
      },
      {
        id: "content",
        label: "Course and content creation",
        hint: "Learning material, written or recorded",
        packages: [
          { id: "outline", label: "Course outline and slides", hint: "Structure plus teaching deck", min: 400_000, max: 1_000_000 },
          { id: "study-pack", label: "Study guides and worksheets", hint: "Printable learning pack", min: 300_000, max: 800_000 },
          { id: "elearning", label: "Interactive e-learning module", hint: "One module with activities", min: 600_000, max: 1_800_000 },
          { id: "video-course", label: "Video course", hint: "5 lessons, scripted and edited", min: 1_500_000, max: 4_000_000 },
        ],
        addons: [
          { id: "quiz-bank", label: "Quiz bank", min: 100_000, max: 300_000 },
          { id: "translation", label: "Kiswahili translation", min: 150_000, max: 500_000 },
          { id: "captions", label: "Video editing and captions", min: 200_000, max: 600_000 },
        ],
      },
      {
        id: "consulting",
        label: "Edtech consulting and setup",
        hint: "Choosing and setting up the right tools",
        packages: [
          { id: "audit", label: "Tech audit for a school", hint: "What you have and what you need", min: 300_000, max: 800_000 },
          { id: "lms", label: "Learning platform setup", hint: "Moodle or Google Classroom", min: 800_000, max: 2_200_000 },
          { id: "lab", label: "Computer lab plan", hint: "Layout, equipment and budget", min: 400_000, max: 1_200_000 },
        ],
        addons: [
          { id: "staff", label: "Staff onboarding", min: 200_000, max: 500_000 },
          { id: "support", label: "1 month of support", min: 300_000, max: 800_000 },
          { id: "handbook", label: "Admin handbook", min: 100_000, max: 300_000 },
        ],
      },
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

/** Short range for option cards, e.g. "TZS 250,000 to 500,000" or "$100 to $190". */
export function formatRange(min: number, max: number, usd: boolean) {
  return usd
    ? `${formatUSD(min)} to ${formatUSD(max)}`
    : `${formatTZS(min)} to ${max.toLocaleString("en-US")}`
}
