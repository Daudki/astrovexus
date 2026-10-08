import { Router } from "express"
import rateLimit from "express-rate-limit"
import { z } from "zod"
import { subscribe } from "../lib/mailer.js"

export const subscribeRouter = Router()

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { ok: false, message: "Too many attempts. Please try again later." },
})

const body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  name: z.string().trim().max(80).optional(),
  lang: z.enum(["en", "sw"]).default("en"),
  // Honeypot: real users never fill this in.
  website: z.string().optional(),
})

subscribeRouter.post("/subscribe", limiter, async (req, res) => {
  const parsed = body.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ ok: false, message: "Please enter a valid email address." })
    return
  }

  const { website, ...data } = parsed.data
  if (website) {
    res.json({ ok: true }) // bot: pretend success, do nothing
    return
  }

  try {
    await subscribe({ ...data, name: data.name || undefined })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(502).json({ ok: false, message: "Could not sign you up right now. Please try again later." })
  }
})
