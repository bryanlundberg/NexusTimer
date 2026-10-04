import { describe, expect, it } from 'vitest'
import { passwordResetEmail, verificationEmail, welcomeEmail } from '../src/modules/auth/auth.emails'

const hostileName = '<a href="https://evil.test">Claim prize</a>'

describe('auth emails', () => {
  it('escapes the user name everywhere it is interpolated', () => {
    for (const { html } of [
      verificationEmail({ name: hostileName, code: '123456' }),
      passwordResetEmail({ name: hostileName, resetUrl: 'https://nexustimer.com/reset-password?oobCode=abc' }),
      welcomeEmail({ name: hostileName })
    ]) {
      expect(html).not.toContain('<a href="https://evil.test">')
      expect(html).toContain('&lt;a href=&quot;https://evil.test&quot;&gt;')
    }
  })

  it('switches the verification copy for resends', () => {
    expect(verificationEmail({ name: 'Ana', code: '123456' }).subject).toBe('Verify your NexusTimer account')
    expect(verificationEmail({ name: 'Ana', code: '123456', isResend: true }).subject).toBe('Your new NexusTimer code')
  })
})
