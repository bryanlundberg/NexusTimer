export const SITE_URL = 'https://nexustimer.com'

export const EMAIL_COLORS = {
  page: '#f8f4f4',
  card: '#ffffff',
  cardBorder: '#ede6e5',
  ink: '#080914',
  muted: '#6e7182',
  border: '#e5e6eb',
  field: '#f4f4f7',
  primary: '#615fff',
  primaryTint: '#e7e7ff',
  onPrimary: '#ffffff',
  record: '#bb4d00',
  slab: '#020202',
  slabInk: '#fafafb',
  slabMuted: '#9da0b0',
  slabBorder: '#1f2026'
}

export const DISPLAY_FONT = "'Chakra Petch', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
export const BODY_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const C = EMAIL_COLORS

export type EmailLayout = {
  title: string
  preheader: string
  eyebrow: string
  heading: string
  body: string
  footnote: string
}

type Notched = { fill: string; cut: number; content: string; contentStyle: string; fullWidth?: boolean }

function notched({ fill, cut, content, contentStyle, fullWidth }: Notched) {
  const width = fullWidth
    ? ' width="100%" style="width:100%;border-collapse:collapse"'
    : ' style="border-collapse:collapse"'
  const cell = `padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly`
  const corner = (triangle: string) =>
    `<td width="${cut}" height="${cut}" style="width:${cut}px;height:${cut}px;${cell};vertical-align:top"><!--[if !mso]><!--><div style="width:0;height:0;${triangle}"></div><!--<![endif]--></td>`
  const strip = `<td colspan="2" height="${cut}" style="height:${cut}px;${cell};background:${fill}">&nbsp;</td>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${width}>
<tr>${strip}${corner(`border-bottom:${cut}px solid ${fill};border-right:${cut}px solid transparent`)}</tr>
<tr><td colspan="3" style="background:${fill};${contentStyle}">${content}</td></tr>
<tr>${corner(`border-top:${cut}px solid ${fill};border-left:${cut}px solid transparent`)}${strip}</tr>
</table>`
}

const block = (content: string, padding: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${padding}">${content}</td></tr></table>`

export const emailText = (html: string) =>
  `<p style="margin:0 0 16px;font:400 15px/1.6 ${BODY_FONT};color:${C.ink}">${html}</p>`

export const emailNote = (html: string) =>
  `<p style="margin:0 0 16px;font:400 13px/1.6 ${BODY_FONT};color:${C.muted}">${html}</p>`

export function emailButton({ href, label }: { href: string; label: string }) {
  return block(
    notched({
      fill: C.primary,
      cut: 9,
      contentStyle: 'padding:0',
      content: `<a href="${href}" style="display:block;padding:4px 28px;font:600 14px/20px ${DISPLAY_FONT};letter-spacing:0.02em;color:${C.onPrimary};text-decoration:none">${label}</a>`
    }),
    '8px 0 24px'
  )
}

export function emailCode(code: string) {
  return block(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" style="padding:22px 12px;background:${C.field};border:1px solid ${C.border};font:600 34px/1 ${DISPLAY_FONT};letter-spacing:0.3em;color:${C.ink}"><span style="padding-left:0.3em">${code}</span></td>
</tr></table>`,
    '8px 0 16px'
  )
}

export const emailPanel = (html: string) =>
  block(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:16px;background:${C.field};border:1px solid ${C.border}">${html}</td></tr></table>`,
    '8px 0 16px'
  )

function eyebrow(label: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="8" style="width:8px;padding:0;vertical-align:middle"><div style="width:8px;height:8px;background:${C.primary};font-size:0;line-height:0">&nbsp;</div></td>
<td style="padding:0 10px;white-space:nowrap;vertical-align:middle;font:600 11px/1 ${DISPLAY_FONT};letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">${label}</td>
<td width="100%" style="width:100%;padding:0;vertical-align:middle"><div style="height:1px;background:${C.border};font-size:0;line-height:1px">&nbsp;</div></td>
</tr></table>`
}

function header() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding:0 10px 0 0;vertical-align:middle"><a href="${SITE_URL}" style="text-decoration:none"><img src="${SITE_URL}/email/brand-mark.png" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0"></a></td>
<td style="vertical-align:middle;font:700 16px/1 ${DISPLAY_FONT};letter-spacing:-0.02em"><a href="${SITE_URL}" style="color:${C.ink};text-decoration:none">NEXUSTIMER<span style="color:${C.muted}">.COM</span></a></td>
</tr></table>`
}

function footer(footnote: string) {
  return notched({
    fill: C.slab,
    cut: 14,
    fullWidth: true,
    contentStyle: 'padding:12px 32px',
    content: `<p style="margin:0 0 20px;font:400 12px/1.6 ${BODY_FONT};color:${C.slabMuted}">${footnote}</p>
<div style="height:1px;background:${C.slabBorder};font-size:0;line-height:1px">&nbsp;</div>
<p style="margin:16px 0 0;font:700 12px/1 ${DISPLAY_FONT};letter-spacing:-0.01em"><a href="${SITE_URL}" style="color:${C.slabInk};text-decoration:none">NEXUSTIMER<span style="color:${C.slabMuted}">.COM</span></a></p>`
  })
}

export function renderEmail({ title, preheader, eyebrow: label, heading, body, footnote }: EmailLayout) {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap" rel="stylesheet">
<style>
@media (max-width:600px){.nx-pad{padding:32px 24px 16px!important}.nx-h1{font-size:22px!important}}
</style>
<!--[if mso]><style>body,table,td,p,a,span,h1{font-family:'Segoe UI',Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all">${preheader}${'&#847;&zwnj;&nbsp;'.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page}">
<tr><td align="center" style="padding:40px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
<tr><td style="padding:0 4px 20px">${header()}</td></tr>
<tr><td class="nx-pad" style="padding:40px 40px 24px;background:${C.card};border:1px solid ${C.cardBorder}">
${eyebrow(label)}
<h1 class="nx-h1" style="margin:20px 0 16px;font:700 26px/1.2 ${DISPLAY_FONT};letter-spacing:-0.01em;color:${C.ink}">${heading}</h1>
${body}
</td></tr>
<tr><td style="padding:8px 0 0">${footer(footnote)}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}
