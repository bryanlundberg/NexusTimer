interface TemplateArgs {
  name: string
  resetUrl: string
}

export function renderPasswordResetEmail({ name, resetUrl }: TemplateArgs): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hey ${name}, reset your password</h2>
      <p>We received a request to reset your NexusTimer password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
      <p style="padding:16px 0">
        <a href="${resetUrl}" style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Reset password</a>
      </p>
      <p style="color:#666;font-size:0.85rem">Or copy this link into your browser:<br/><span style="word-break:break-all">${resetUrl}</span></p>
      <p style="color:#888;font-size:0.85rem">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `
}

export const PASSWORD_RESET_EMAIL_SUBJECT = 'Reset your NexusTimer password'
