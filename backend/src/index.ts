import express from "express"
import cors from "cors"
import helmet from "helmet"
import { env, dryRun } from "./env.js"
import { subscribeRouter } from "./routes/subscribe.js"

const app = express()
app.set("trust proxy", 1) // correct client IPs behind Render/Railway/Fly for rate limiting

const origins = env.FRONTEND_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)

app.use(helmet())
app.use(cors({ origin: origins, methods: ["GET", "POST"] }))
app.use(express.json({ limit: "10kb" }))

app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

app.use("/api", subscribeRouter)

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Not found" })
})

app.listen(env.PORT, () => {
  console.log(`astrovexus-api on :${env.PORT}${dryRun ? " (dry-run: no RESEND_API_KEY)" : ""}`)
})
