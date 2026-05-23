import { resend } from '@/shared/lib/resend'
import { getWelcomeEmailSubject, renderWelcomeEmail } from './welcome-email-template'

const FROM_ADDRESS = 'NexusTimer <onboarding@nexustimer.com>'

interface SendWelcomeEmailArgs {
  email: string
  name: string
}

export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailArgs) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: getWelcomeEmailSubject(),
    html: renderWelcomeEmail({ name })
  })
}
