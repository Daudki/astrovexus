import "dotenv/config"
import { z } from "zod"

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  RESEND_API_KEY: z.string().optional().default(""),
  RESEND_SEGMENT_ID: z.string().optional().default(""),
  MAIL_FROM: z.string().default("AstroVexus <onboarding@resend.dev>"),
  MAIL_REPLY_TO: z.string().optional().default(""),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error("Invalid environment:", z.prettifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data

export const dryRun = !env.RESEND_API_KEY
if (dryRun && env.NODE_ENV === "production") {
  console.error("RESEND_API_KEY is required in production.")
  process.exit(1)
}
