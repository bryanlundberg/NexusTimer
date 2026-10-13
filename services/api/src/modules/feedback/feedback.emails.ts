import { escapeHtml } from '../../lib/escape-html'
import { BODY_FONT, DISPLAY_FONT, EMAIL_COLORS, emailPanel, renderEmail } from '../../lib/email-layout'

type FeedbackEmailArgs = { email: string; name: string; rating: number; comment?: string }

const MAX_RATING = 5

function ratingSquares(rating: number) {
  return Array.from(
    { length: MAX_RATING },
    (_, index) =>
      `<span style="display:inline-block;width:10px;height:10px;margin-right:3px;background:${index < rating ? EMAIL_COLORS.record : EMAIL_COLORS.border}"></span>`
  ).join('')
}

function detailRow(label: string, value: string) {
  return `<tr>
<td width="96" style="width:96px;padding:12px 0;border-top:1px solid ${EMAIL_COLORS.border};vertical-align:top;font:600 11px/20px ${DISPLAY_FONT};letter-spacing:0.14em;text-transform:uppercase;color:${EMAIL_COLORS.muted}">${label}</td>
<td style="padding:12px 0;border-top:1px solid ${EMAIL_COLORS.border};vertical-align:top;font:400 15px/20px ${BODY_FONT};color:${EMAIL_COLORS.ink}">${value}</td>
</tr>`
}

export function feedbackEmail({ email, name, rating, comment }: FeedbackEmailArgs) {
  const safeEmail = escapeHtml(email)
  const details = [
    detailRow('Name', escapeHtml(name)),
    detailRow(
      'Email',
      `<a href="mailto:${safeEmail}" style="color:${EMAIL_COLORS.primary};text-decoration:none">${safeEmail}</a>`
    ),
    detailRow('Rating', `${ratingSquares(rating)}&nbsp;${rating}/${MAX_RATING}`)
  ].join('')

  return {
    subject: 'New review on NexusTimer',
    html: renderEmail({
      title: 'New review on NexusTimer',
      preheader: `${escapeHtml(name)} rated NexusTimer ${rating}/${MAX_RATING}.`,
      eyebrow: 'Feedback',
      heading: 'New review',
      body: [
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${EMAIL_COLORS.border}">${details}</table>`,
        `<div style="height:16px;line-height:16px;font-size:0">&nbsp;</div>`,
        emailPanel(
          comment
            ? `<p style="margin:0;font:400 15px/1.6 ${BODY_FONT};color:${EMAIL_COLORS.ink};white-space:pre-wrap">${escapeHtml(comment)}</p>`
            : `<p style="margin:0;font:400 14px/1.6 ${BODY_FONT};color:${EMAIL_COLORS.muted}">No comment</p>`
        )
      ].join(''),
      footnote: 'Sent from the feedback form in the app.'
    })
  }
}
