import { escapeHtml } from '../../lib/escape-html'
import {
  BODY_FONT,
  DISPLAY_FONT,
  EMAIL_COLORS,
  SITE_URL,
  emailButton,
  emailCode,
  emailNote,
  emailPanel,
  emailText,
  renderEmail
} from '../../lib/email-layout'

export type EmailContent = { subject: string; html: string }

export function verificationEmail({ name, code }: { name: string; code: string }) {
  const safeCode = escapeHtml(code)

  return {
    subject: 'Verify your NexusTimer account',
    html: renderEmail({
      title: 'Verify your NexusTimer account',
      preheader: `${safeCode} is your verification code. It expires in 10 minutes.`,
      eyebrow: 'Account verification',
      heading: 'Confirm your email address',
      body: [
        emailText(`Hi ${escapeHtml(name)}, enter this code in NexusTimer to finish creating your account.`),
        emailCode(safeCode),
        emailNote('The code expires in 10 minutes.')
      ].join(''),
      footnote:
        "You received this email because this address was used to sign up for NexusTimer. If that wasn't you, ignore it and no account will be created."
    })
  } satisfies EmailContent
}

export function passwordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  const safeUrl = escapeHtml(resetUrl)

  return {
    subject: 'Reset your NexusTimer password',
    html: renderEmail({
      title: 'Reset your NexusTimer password',
      preheader: 'Choose a new password for your account. The link expires in 30 minutes.',
      eyebrow: 'Password reset',
      heading: 'Reset your password',
      body: [
        emailText(
          `Hi ${escapeHtml(name)}, we received a request to reset the password for your account. Choose a new one with the button below.`
        ),
        emailButton({ href: safeUrl, label: 'Choose a new password' }),
        emailNote('The link expires in 30 minutes and works only once.'),
        emailNote("If the button doesn't work, paste this link into your browser:"),
        emailPanel(
          `<a href="${safeUrl}" style="font:400 13px/1.5 ${BODY_FONT};color:${EMAIL_COLORS.primary};text-decoration:none;word-break:break-all">${safeUrl}</a>`
        )
      ].join(''),
      footnote: "If you didn't ask to reset your password, you can ignore this email. Your password won't change."
    })
  } satisfies EmailContent
}

const WELCOME_STEPS = [
  {
    title: 'Register your cubes',
    text: 'Add each cube you own and switch between them freely. Every cube keeps its own sessions and averages.'
  },
  {
    title: 'Import your solves',
    text: 'Bring your history from csTimer, CubeDesk or TwistyTimer in a few clicks.'
  },
  {
    title: 'Train your algorithms',
    text: 'Learn OLL, PLL and more with the trainer, then race your friends in free play.'
  }
]

function welcomeSteps() {
  const rows = WELCOME_STEPS.map(
    ({ title, text }, index) => `<tr>
<td width="40" style="width:40px;padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};vertical-align:top;font:600 13px/22px ${DISPLAY_FONT};letter-spacing:0.04em;color:${EMAIL_COLORS.primary}">${String(index + 1).padStart(2, '0')}</td>
<td style="padding:16px 0;border-top:1px solid ${EMAIL_COLORS.border};vertical-align:top">
<p style="margin:0;font:600 15px/22px ${DISPLAY_FONT};color:${EMAIL_COLORS.ink}">${title}</p>
<p style="margin:4px 0 0;font:400 14px/1.55 ${BODY_FONT};color:${EMAIL_COLORS.muted}">${text}</p>
</td>
</tr>`
  ).join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${EMAIL_COLORS.border}">${rows}</table>`
}

export function welcomeEmail({ name }: { name: string }) {
  return {
    subject: 'Welcome to NexusTimer',
    html: renderEmail({
      title: 'Welcome to NexusTimer',
      preheader: 'Your account is ready. Here are three good places to start.',
      eyebrow: 'Welcome',
      heading: 'Your account is ready',
      body: [
        emailText(`Hi ${escapeHtml(name)}, thanks for joining NexusTimer. Here are three good places to start.`),
        welcomeSteps(),
        `<div style="height:24px;line-height:24px;font-size:0">&nbsp;</div>`,
        emailButton({ href: `${SITE_URL}/app`, label: 'Open the timer' })
      ].join(''),
      footnote: 'You received this email because you created a NexusTimer account.'
    })
  } satisfies EmailContent
}
