import { getWelcomeEmailSubject, renderWelcomeEmail } from './welcome-email-template'
import brevo from '@/shared/lib/brevo'

interface SendWelcomeEmailArgs {
  email: string
  name: string
}

export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailArgs) {
  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email }],
    sender: { name: 'Nexus Timer', email: 'noreply@nexustimer.com' },
    htmlContent: renderWelcomeEmail({ name }),
    subject: getWelcomeEmailSubject()
  })
}
