import { Resend } from "resend"
import { env, dryRun } from "../env.js"
import { welcomeEmail, type Lang } from "../templates/welcome.js"

const resend = dryRun ? null : new Resend(env.RESEND_API_KEY)

export interface Subscriber {
  email: string
  name?: string
  lang: Lang
}

/** Store the subscriber (Resend Audience) and send the autoresponder. */
export async function subscribe({ email, name, lang }: Subscriber) {
  if (!resend) {
    console.log(`[dry-run] subscribe ${email} (${lang})`)
    return
  }

  if (env.RESEND_AUDIENCE_ID) {
    const { error } = await resend.contacts.create({
      email,
      firstName: name,
      audienceId: env.RESEND_AUDIENCE_ID,
    })
    if (error) throw new Error(`Resend contacts.create failed: ${error.message}`)
  }

  const mail = welcomeEmail(lang, name)
  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to: email,
    replyTo: env.MAIL_REPLY_TO || undefined,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  })
  if (error) throw new Error(`Resend emails.send failed: ${error.message}`)
}
