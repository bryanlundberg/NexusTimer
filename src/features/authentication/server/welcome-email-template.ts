interface TemplateArgs {
  name: string
}

export function renderWelcomeEmail({ name }: TemplateArgs): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hi ${name}, welcome to NexusTimer!</h2>
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
}

export function getWelcomeEmailSubject(): string {
  return "Welcome to NexusTimer – Let's get cubing!"
}
