export const studio = {
  name: "AstroVexus",
  place: "Tanzania",
  email: "daudki044@gmail.com",
  phone: "+255 625 596 269",
  phoneHref: "+255625596269",
  blurb:
    "A new studio in Tanzania. Two founders, a programmer and a designer, building real software, honest brands, and the products we wish existed here.",
}

export const nav = [
  { label: "What we do", href: "/services" },
  { label: "Who we are", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export const services = [
  {
    key: "software",
    icon: "Code",
    title: "Software & Web",
    body: "Web apps, dashboards, landing pages, and the small tools that take repetitive work off your plate.",
  },
  {
    key: "design",
    icon: "Palette",
    title: "Brand & Design",
    body: "Logos, brand systems, and digital presence. Work that looks professional and loads fast.",
  },
  {
    key: "ai",
    icon: "Sparkles",
    title: "AI & Automation",
    body: "Practical AI integrations: assistants, classifiers, and local-model setups you can actually run.",
  },
  {
    key: "edtech",
    icon: "GraduationCap",
    title: "EdTech & Training",
    body: "Learning tools for schools, plus digital skills training for people building their own things.",
  },
] as const

export const founders = [
  {
    name: "Daudi Kisulo",
    role: "Programmer",
    initials: "DK",
    photo: "/team/daudi.jpg",
    skills: ["Linux", "Web development", "AI & machine learning"],
    bio: "I write code. Linux is my daily environment, web development is my craft, and AI and machine learning are what I am learning next. I am not the finished article. I am still learning, and I say so.",
  },
  {
    name: "Mike Milan",
    role: "Designer",
    initials: "MM",
    photo: "/team/mike.jpg",
    skills: ["Graphic design", "Web design", "AI training", "Digital skills"],
    bio: "I do graphic design and web design, I have experience training AI, and I work in affiliate marketing and digital skills. Good design is how a business earns trust before it says a word.",
  },
]

export const values = [
  {
    title: "We are new, and we say so",
    body: "AstroVexus has no finished client projects yet. That is the truth. Work with us now and you get founders who are building their name.",
  },
  {
    title: "We finish what we start",
    body: "Working software beats another prototype. Every project we take on ships.",
  },
  {
    title: "We tell you the truth",
    body: "If a job is beyond us, we say so. If a deadline is tight, we say it early.",
  },
  {
    title: "We build for here",
    body: "Tanzania first. Then wherever the work takes us.",
  },
]

export const verticals = [
  "Agritech",
  "Media & entertainment",
  "Health tech",
  "Logistics & transport",
  "Fintech & commerce",
  "EdTech",
]

export const faqs = [
  {
    q: "You don't have a portfolio yet. Why should I trust you?",
    a: "Because we tell you that upfront instead of hiding it. You get two people building their name on your project, which means it gets more attention, not less.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on the scope. We talk, we understand what you need, then we write a price and timeline down before any work starts. No surprises later.",
  },
  {
    q: "How long does a typical project take?",
    a: "Small sites and tools can ship in one to two weeks. Larger builds take longer, and we'll give you a real timeline once we know the scope.",
  },
  {
    q: "Do you work with clients outside your area?",
    a: "Yes. The work travels. Most of what we build is remote-friendly from day one.",
  },
  {
    q: "What if I need changes after the project ships?",
    a: "We stick around for fixes and support after launch. That's part of how we work, not an extra ask.",
  },
  {
    q: "How do I start?",
    a: "Send us a message with what you're working on. We'll ask questions until we both understand it properly, then send you a written scope.",
  },
] as const

export const process = [
  { step: "01", title: "Talk", body: "You describe the problem. We ask questions until we both understand it properly." },
  { step: "02", title: "Plan", body: "Scope, price, timeline. Written down. No surprises later." },
  { step: "03", title: "Build", body: "Regular checkpoints. You see progress, not just the finish line." },
  { step: "04", title: "Ship", body: "Live, working software. We stick around for fixes and support." },
]
