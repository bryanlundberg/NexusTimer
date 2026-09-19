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

const ASSET_URL = 'https://nexustimer.com'

const COLORS = {
  page: '#f3f3f8',
  card: '#ffffff',
  border: '#e3e3ee',
  ink: '#14152b',
  muted: '#6b6d85',
  faint: '#9a9cb3',
  accent: '#4f46e5',
  accentSoft: '#eef0ff',
  panel: '#fafaff',
  header: '#0f1028'
}

const CUBE_STRIPE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

const DISPLAY_FONT = "'Chakra Petch', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const BODY_FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const absolute = (url: string, base: string) => (url.startsWith('/') ? `${base}${url}` : url)

function renderAvatar(sender: Sender, appUrl: string): string {
  if (sender.image) {
    const src = escapeHtml(absolute(sender.image, appUrl))
    return `<img src="${src}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border-radius:12px;object-fit:cover;border:0">`
  }
  const initials = escapeHtml(sender.name.substring(0, 2).toUpperCase())
  return `<div style="width:56px;height:56px;border-radius:12px;background:${COLORS.accentSoft};color:${COLORS.accent};font:700 18px/56px ${DISPLAY_FONT};text-align:center">${initials}</div>`
}

export function renderFriendRequestEmail({ sender, mutualCount, appUrl }: TemplateArgs): string {
  const name = escapeHtml(sender.name)
  const requestsUrl = `${appUrl}/friends?tab=requests`
  const profileUrl = `${appUrl}/people/${sender.id}`
  const privacyUrl = `${appUrl}/account?tab=privacy`

  const meta = [
    sender.wcaId && `WCA ID ${escapeHtml(sender.wcaId)}`,
    mutualCount > 0 && `${mutualCount} mutual ${mutualCount === 1 ? 'friend' : 'friends'}`
  ]
    .filter(Boolean)
    .join(' &middot; ')

  const stripe = CUBE_STRIPE.map(
    (color) => `<td height="4" style="height:4px;line-height:4px;font-size:0;background:${color}">&nbsp;</td>`
  ).join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${name} wants to add you as a friend</title>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${COLORS.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${name} wants to add you as a friend on Nexus Timer.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.page}">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${COLORS.card};border:1px solid ${COLORS.border}">
    <tr><td style="background:${COLORS.header};padding:14px 32px 14px 12px">
      <a href="${appUrl}" style="text-decoration:none"><img src="${ASSET_URL}/brand_logo.png" width="180" height="60" alt="Nexus Timer" style="display:block;width:180px;height:60px;border:0"></a>
    </td></tr>
    <tr><td style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${stripe}</tr></table></td></tr>
    <tr><td style="padding:36px 32px 8px">
      <p style="margin:0 0 12px;font:700 11px/1 ${DISPLAY_FONT};letter-spacing:0.16em;text-transform:uppercase;color:${COLORS.accent}">Friend request</p>
      <h1 style="margin:0 0 12px;font:700 24px/1.25 ${DISPLAY_FONT};color:${COLORS.ink}">${name} wants to add you as a friend</h1>
      <p style="margin:0;font:400 15px/1.6 ${BODY_FONT};color:${COLORS.muted}">Once you accept, you can message each other, compare your times and see when the other is online.</p>
    </td></tr>
    <tr><td style="padding:24px 32px 8px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.accent};background:${COLORS.panel}">
        <tr>
          <td width="56" style="padding:16px 0 16px 16px;vertical-align:middle">${renderAvatar(sender, appUrl)}</td>
          <td style="padding:16px;vertical-align:middle">
            <p style="margin:0;font:700 16px/1.3 ${DISPLAY_FONT};color:${COLORS.ink}">${name}</p>
            ${meta ? `<p style="margin:4px 0 0;font:400 13px/1.4 ${BODY_FONT};color:${COLORS.muted}">${meta}</p>` : ''}
            <p style="margin:6px 0 0;font:400 13px/1.4 ${BODY_FONT}"><a href="${profileUrl}" style="color:${COLORS.accent};text-decoration:none">View profile &rsaquo;</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 36px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${COLORS.accent}"><a href="${requestsUrl}" style="display:inline-block;padding:13px 26px;font:700 14px/1 ${DISPLAY_FONT};letter-spacing:0.04em;color:#ffffff;text-decoration:none">Review request</a></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:20px 32px 28px;border-top:1px solid ${COLORS.border}">
      <p style="margin:0;font:400 12px/1.6 ${BODY_FONT};color:${COLORS.faint}">To stop receiving these emails, turn them off in your account&#39;s <a href="${privacyUrl}" style="color:${COLORS.muted};text-decoration:underline">privacy settings</a>.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

export function getFriendRequestEmailSubject(senderName: string): string {
  return `${senderName} wants to add you as a friend on Nexus Timer`
}
