import { getFeedbackEmailSubject, renderFeedbackEmail } from './feedback-email-template'
import brevo from '@/shared/lib/brevo'

interface SendFeedbackEmailArgs {
  email: string
  name: string
  rating: number
  comment?: string
}

export async function sendFeedbackEmail({ email, name, rating, comment }: SendFeedbackEmailArgs) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: adminEmail }],
    sender: { name: 'Nexus Timer', email: 'noreply@nexustimer.com' },
    htmlContent: renderFeedbackEmail({ email, name, rating, comment }),
    subject: getFeedbackEmailSubject()
  })
}
