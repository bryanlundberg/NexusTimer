const SEND_TIMEOUT_MS = 10_000
const SENDER_ADDRESS = 'noreply@nexustimer.com'

export type Mail = { to: string; subject: string; html: string }
export type Mailer = (mail: Mail) => Promise<void>
export type Mailers = { resend: Mailer; brevo: Mailer }

async function post(provider: string, url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
  })
  if (!res.ok) throw new Error(`${provider} rejected the email with ${res.status}: ${await res.text()}`)
}

function notConfigured(variable: string): Mailer {
  return () => Promise.reject(new Error(`${variable} is not configured`))
}

function resendMailer(apiKey: string): Mailer {
  return ({ to, subject, html }) =>
    post(
      'Resend',
      'https://api.resend.com/emails',
      { authorization: `Bearer ${apiKey}` },
      { from: `NexusTimer <${SENDER_ADDRESS}>`, to, subject, html }
    )
}

function brevoMailer(apiKey: string): Mailer {
  return ({ to, subject, html }) =>
    post(
      'Brevo',
      'https://api.brevo.com/v3/smtp/email',
      { 'api-key': apiKey },
      { sender: { name: 'Nexus Timer', email: SENDER_ADDRESS }, to: [{ email: to }], subject, htmlContent: html }
    )
}

export function createMailers(keys: { resend?: string; brevo?: string }): Mailers {
  return {
    resend: keys.resend ? resendMailer(keys.resend) : notConfigured('RESEND_API_KEY'),
    brevo: keys.brevo ? brevoMailer(keys.brevo) : notConfigured('BREVO_API_KEY')
  }
}
