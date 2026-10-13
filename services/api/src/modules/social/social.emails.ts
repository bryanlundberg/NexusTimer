import { escapeHtml } from '../../lib/escape-html'
import {
  BODY_FONT,
  DISPLAY_FONT,
  EMAIL_COLORS,
  emailButton,
  emailPanel,
  emailText,
  renderEmail,
  type EmailPart
} from '../../lib/email-layout'

interface Sender {
  id: string
  name: string
  image?: string
  wcaId?: string
}

interface TemplateArgs {
  sender: Sender
  mutualCount: number
  appUrl: string
}

const absolute = (url: string, base: string) => (url.startsWith('/') ? `${base}${url}` : url)

function renderAvatar(sender: Sender, appUrl: string): string {
  if (sender.image) {
    const src = escapeHtml(absolute(sender.image, appUrl))
    return `<img src="${src}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border-radius:50%;object-fit:cover;border:0">`
  }
  const initials = escapeHtml(sender.name.substring(0, 2).toUpperCase())
  return `<div style="width:48px;height:48px;border-radius:50%;background:${EMAIL_COLORS.primaryTint};color:${EMAIL_COLORS.primary};font:600 16px/48px ${DISPLAY_FONT};text-align:center">${initials}</div>`
}

function renderSenderCard({ sender, mutualCount, appUrl }: TemplateArgs): EmailPart {
  const profileUrl = `${appUrl}/people/${sender.id}`
  const meta = [
    sender.wcaId && `WCA ID ${sender.wcaId}`,
    mutualCount > 0 && `${mutualCount} mutual ${mutualCount === 1 ? 'friend' : 'friends'}`
  ].filter((item): item is string => Boolean(item))
  const metaHtml = meta.map(escapeHtml).join(' &middot; ')

  return emailPanel({
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="48" style="width:48px;padding:0 14px 0 0;vertical-align:middle">${renderAvatar(sender, appUrl)}</td>
<td style="vertical-align:middle">
<p style="margin:0;font:600 16px/1.3 ${DISPLAY_FONT};color:${EMAIL_COLORS.ink}">${escapeHtml(sender.name)}</p>
${metaHtml ? `<p style="margin:4px 0 0;font:400 13px/1.4 ${BODY_FONT};color:${EMAIL_COLORS.muted}">${metaHtml}</p>` : ''}
<p style="margin:8px 0 0;font:600 13px/1 ${DISPLAY_FONT}"><a href="${escapeHtml(profileUrl)}" style="color:${EMAIL_COLORS.primary};text-decoration:none">View profile</a></p>
</td>
</tr></table>`,
    text: [sender.name, meta.join(' · '), `View profile: ${profileUrl}`].filter(Boolean).join('\n')
  })
}

function privacyFootnote(appUrl: string): EmailPart {
  const privacyUrl = `${appUrl}/account?tab=privacy`

  return {
    html: `To stop receiving these emails, turn them off in your <a href="${escapeHtml(privacyUrl)}" style="color:${EMAIL_COLORS.slabInk};text-decoration:underline">privacy settings</a>.`,
    text: `To stop receiving these emails, turn them off in your privacy settings: ${privacyUrl}`
  }
}

export function friendRequestEmail(args: TemplateArgs) {
  const { name } = args.sender

  return {
    subject: `${name} wants to add you as a friend on Nexus Timer`,
    ...renderEmail({
      title: `${name} wants to add you as a friend`,
      preheader: `${name} wants to add you as a friend on Nexus Timer.`,
      eyebrow: 'Friend request',
      heading: `${name} wants to add you as a friend`,
      body: [
        emailText('Once you accept, you can message each other, compare your times and see when the other is online.'),
        renderSenderCard(args),
        emailButton({ href: `${args.appUrl}/friends?tab=requests`, label: 'Review request' })
      ],
      footnote: privacyFootnote(args.appUrl)
    })
  }
}
