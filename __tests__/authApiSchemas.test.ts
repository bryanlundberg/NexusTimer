import {
  forgotPasswordRequestSchema,
  registerRequestSchema,
  resendRequestSchema,
  resetPasswordRequestSchema,
  verifyCodeRequestSchema
} from '@/features/authentication/model/api-schemas'

describe('registerRequestSchema', () => {
  it('accepts a valid payload', () => {
    const result = registerRequestSchema.safeParse({
      name: 'Bryan',
      email: 'a@b.co',
      password: 'longenough'
    })
    expect(result.success).toBe(true)
  })

  it('trims the name', () => {
    const result = registerRequestSchema.safeParse({
      name: '  Bryan  ',
      email: 'a@b.co',
      password: 'longenough'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Bryan')
    }
  })

  it('rejects a name shorter than 2 chars (after trim)', () => {
    expect(registerRequestSchema.safeParse({ name: ' A ', email: 'a@b.co', password: 'longenough' }).success).toBe(
      false
    )
  })

  it('rejects a name longer than 50 chars', () => {
    expect(
      registerRequestSchema.safeParse({ name: 'a'.repeat(51), email: 'a@b.co', password: 'longenough' }).success
    ).toBe(false)
  })

  it('rejects invalid emails', () => {
    expect(
      registerRequestSchema.safeParse({ name: 'Bryan', email: 'not-an-email', password: 'longenough' }).success
    ).toBe(false)
  })

  it('rejects a password shorter than 8 chars', () => {
    expect(registerRequestSchema.safeParse({ name: 'Bryan', email: 'a@b.co', password: '1234567' }).success).toBe(false)
  })

  it('rejects a password longer than 72 chars', () => {
    expect(registerRequestSchema.safeParse({ name: 'Bryan', email: 'a@b.co', password: 'x'.repeat(73) }).success).toBe(
      false
    )
  })
})

describe('verifyCodeRequestSchema', () => {
  it('accepts a valid email and 6-digit code', () => {
    expect(verifyCodeRequestSchema.safeParse({ email: 'a@b.co', code: '123456' }).success).toBe(true)
  })

  it('rejects a non-numeric code', () => {
    expect(verifyCodeRequestSchema.safeParse({ email: 'a@b.co', code: 'abcdef' }).success).toBe(false)
  })

  it('rejects a code that is not exactly 6 chars', () => {
    expect(verifyCodeRequestSchema.safeParse({ email: 'a@b.co', code: '12345' }).success).toBe(false)
    expect(verifyCodeRequestSchema.safeParse({ email: 'a@b.co', code: '1234567' }).success).toBe(false)
  })

  it('rejects when the email is invalid', () => {
    expect(verifyCodeRequestSchema.safeParse({ email: 'nope', code: '123456' }).success).toBe(false)
  })
})

describe('resendRequestSchema', () => {
  it('accepts a valid email', () => {
    expect(resendRequestSchema.safeParse({ email: 'a@b.co' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(resendRequestSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })
})

describe('forgotPasswordRequestSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordRequestSchema.safeParse({ email: 'a@b.co' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(forgotPasswordRequestSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })
})

describe('resetPasswordRequestSchema', () => {
  it('accepts a valid payload', () => {
    expect(resetPasswordRequestSchema.safeParse({ oobCode: 'abc123', password: 'longenough' }).success).toBe(true)
  })

  it('rejects an empty oobCode', () => {
    expect(resetPasswordRequestSchema.safeParse({ oobCode: '', password: 'longenough' }).success).toBe(false)
  })

  it('rejects a password shorter than 8 chars', () => {
    expect(resetPasswordRequestSchema.safeParse({ oobCode: 'abc', password: 'short' }).success).toBe(false)
  })

  it('rejects a password longer than 72 chars', () => {
    expect(resetPasswordRequestSchema.safeParse({ oobCode: 'abc', password: 'x'.repeat(73) }).success).toBe(false)
  })
})
