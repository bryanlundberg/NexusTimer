import { getWelcomeEmailSubject, renderWelcomeEmail } from './welcome-email-template'
import brevo from '@/shared/lib/brevo'
import connectDB from '@/shared/config/mongodb/mongodb'
import Log, { LogType } from '@/entities/log/model/log'

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

export function sendWelcomeEmailInBackground({ email, name }: SendWelcomeEmailArgs) {
  sendWelcomeEmail({ email, name }).catch(async (err) => {
    try {
      await connectDB()
      await Log.create({
        type: LogType.ApiError,
        message: err instanceof Error ? err.message : String(err),
        metadata: {
          source: 'welcome-email',
          email,
          stack: err instanceof Error ? err.stack : undefined
        }
      })
    } catch (logErr) {
      console.error('Failed to log welcome email error:', logErr)
    }
  })
}
