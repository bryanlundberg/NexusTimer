interface TemplateArgs {
  email: string
  name: string
  rating: number
  comment?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderFeedbackEmail({ email, name, rating, comment }: TemplateArgs): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>New review on NexusTimer</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Rating:</strong> ${rating}/5</p>
      <p><strong>Comment:</strong> ${comment ? escapeHtml(comment) : '—'}</p>
    </div>
  `
}

export function getFeedbackEmailSubject(): string {
  return 'New review on NexusTimer'
}
