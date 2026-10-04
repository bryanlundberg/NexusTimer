import { escapeHtml } from '../../lib/escape-html'

type FeedbackEmailArgs = { email: string; name: string; rating: number; comment?: string }

export function feedbackEmail({ email, name, rating, comment }: FeedbackEmailArgs) {
  return {
    subject: 'New review on NexusTimer',
    html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>New review on NexusTimer</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Rating:</strong> ${rating}/5</p>
      <p><strong>Comment:</strong> ${comment ? escapeHtml(comment) : '-'}</p>
    </div>
  `
  }
}
