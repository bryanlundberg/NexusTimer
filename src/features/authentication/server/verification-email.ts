import { resend } from '@/shared/lib/resend'
import { getVerificationEmailSubject, renderVerificationEmail } from './verification-email-template'

const FROM_ADDRESS = 'NexusTimer <noreply@nexustimer.com>'

interface SendVerificationEmailArgs {
  email: string
  name: string
  code: string
  isResend?: boolean
}

export async function sendVerificationEmail({ email, name, code, isResend }: SendVerificationEmailArgs) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: getVerificationEmailSubject(isResend),
    html: renderVerificationEmail({ name, code, isResend })
  })
}
