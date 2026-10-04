export type EmailContent = { subject: string; html: string }

const HTML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char)

export function verificationEmail({ name, code, isResend }: { name: string; code: string; isResend?: boolean }) {
  const safeName = escapeHtml(name)
  const heading = isResend ? `Hey ${safeName}, here's your new code!` : `Hey ${safeName}, welcome to NexusTimer!`

  return {
    subject: isResend ? 'Your new NexusTimer code' : 'Verify your NexusTimer account',
    html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>${heading}</h2>
      <p>Enter this code to verify your account. It expires in 10 minutes.</p>
      <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px 0">${escapeHtml(code)}</div>
      <p style="color:#888;font-size:0.85rem">If you didn't request this, you can ignore this email.</p>
    </div>
  `
  } satisfies EmailContent
}

export function passwordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  const safeUrl = escapeHtml(resetUrl)

  return {
    subject: 'Reset your NexusTimer password',
    html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hey ${escapeHtml(name)}, reset your password</h2>
      <p>We received a request to reset your NexusTimer password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
      <p style="padding:16px 0">
        <a href="${safeUrl}" style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Reset password</a>
      </p>
      <p style="color:#666;font-size:0.85rem">Or copy this link into your browser:<br/><span style="word-break:break-all">${safeUrl}</span></p>
      <p style="color:#888;font-size:0.85rem">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `
  } satisfies EmailContent
}

export function welcomeEmail({ name }: { name: string }) {
  return {
    subject: "Welcome to NexusTimer – Let's get cubing!",
    html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hi ${escapeHtml(name)}, welcome to NexusTimer!</h2>
      <p>We're excited to have you on board as part of our growing community of speedcubing enthusiasts.</p>
      <p style="font-weight:bold;font-size:1.1rem;margin-top:24px">What's next?</p>
      <ol style="padding-left:20px;line-height:1.6">
        <li><strong>Create collections</strong> to track stats per cube without affecting category metrics.</li>
        <li><strong>Import your times</strong> from csTimer, CubeDesk or TwistyTimer.</li>
        <li><strong>Customize your timer</strong> with features and colors that fit your style.</li>
      </ol>
      <p style="margin-top:24px">
        <a href="https://nexustimer.com" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px">Get cubing</a>
      </p>
      <p style="color:#888;font-size:0.85rem;margin-top:32px">Happy cubing,<br/>The NexusTimer Team</p>
    </div>
  `
  } satisfies EmailContent
}
