import type { FeedbackInput, FeedbackResponse } from '@nexustimer/contracts'
import type { Mailer } from '../../infra/mail'
import type { RunInBackground } from '../../platform/background'
import type { LogEntry } from '../logs/logs.service'
import type { UsersService } from '../users/users.service'
import { feedbackEmail } from './feedback.emails'
import type { FeedbackRepository } from './feedback.repository'

export type FeedbackService = {
  submit(userId: string, input: FeedbackInput): Promise<FeedbackResponse>
}

type FeedbackDeps = {
  repository: FeedbackRepository
  users: Pick<UsersService, 'mailContact'>
  mail: Mailer
  adminEmail?: string
  log: (entry: LogEntry) => Promise<void>
  background: RunInBackground
}

export function createFeedbackService({
  repository,
  users,
  mail,
  adminEmail,
  log,
  background
}: FeedbackDeps): FeedbackService {
  async function notifyAdmin(to: string, userId: string, { rating, comment }: FeedbackInput) {
    const contact = await users.mailContact(userId)
    if (!contact) return

    const email = contact.email ?? ''
    try {
      await mail({ to, ...feedbackEmail({ email, name: contact.name, rating, comment }) })
    } catch (error) {
      await log({
        type: 'api_error',
        message: error instanceof Error ? error.message : String(error),
        metadata: { source: 'feedback-email', email, stack: error instanceof Error ? error.stack : undefined }
      })
    }
  }

  return {
    async submit(userId, input) {
      const feedback = await repository.create({ userId, rating: input.rating, comment: input.comment || '' })
      if (adminEmail) background('feedback-email', () => notifyAdmin(adminEmail, userId, input))
      return feedback
    }
  }
}
