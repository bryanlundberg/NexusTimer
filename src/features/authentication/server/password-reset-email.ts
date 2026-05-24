import { resend } from '@/shared/lib/resend'
import { PASSWORD_RESET_EMAIL_SUBJECT, renderPasswordResetEmail } from './password-reset-email-template'

const FROM_ADDRESS = 'NexusTimer <noreply@nexustimer.com>'

interface SendPasswordResetEmailArgs {
  email: string
  name: string
  resetUrl: string
}

export async function sendPasswordResetEmail({ email, name, resetUrl }: SendPasswordResetEmailArgs) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: PASSWORD_RESET_EMAIL_SUBJECT,
    html: renderPasswordResetEmail({ name, resetUrl })
  })
}
