interface TemplateArgs {
  name: string
  code: string
  isResend?: boolean
}

export function renderVerificationEmail({ name, code, isResend }: TemplateArgs): string {
  const heading = isResend ? `Hey ${name}, here's your new code!` : `Hey ${name}, welcome to NexusTimer!`

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>${heading}</h2>
      <p>Enter this code to verify your account. It expires in 10 minutes.</p>
      <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px 0">${code}</div>
      <p style="color:#888;font-size:0.85rem">If you didn't request this, you can ignore this email.</p>
    </div>
  `
}

export function getVerificationEmailSubject(isResend?: boolean): string {
  return isResend ? 'Your new NexusTimer code' : 'Verify your NexusTimer account'
}
