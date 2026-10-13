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

  it('sends a plain text version with the same content', () => {
    const resetUrl = 'https://nexustimer.com/reset-password?oobCode=abc'
    const verification = verificationEmail({ name: 'Ana', code: '482913' })
    const reset = passwordResetEmail({ name: 'Ana', resetUrl })
    const welcome = welcomeEmail({ name: 'Ana' })

    expect(verification.text).toContain('482913')
    expect(reset.text).toContain(`Choose a new password: ${resetUrl}`)
    expect(reset.text.split(resetUrl)).toHaveLength(2)
    expect(welcome.text).toContain('01 Register your cubes')
    for (const { text } of [verification, reset, welcome]) {
      expect(text).toContain('Hi Ana')
      expect(text).not.toMatch(/<[a-z]/i)
      expect(text).not.toMatch(/&[a-z]+;/)
    }
  })
})
