import app from "./app.js"
import { env, dryRun } from "./env.js"

app.listen(env.PORT, () => {
  console.log(`astrovexus-api on :${env.PORT}${dryRun ? " (dry-run: no RESEND_API_KEY)" : ""}`)
})
