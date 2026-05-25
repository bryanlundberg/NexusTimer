import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  createSignInSchema,
  createSignUpSchema,
  createVerifyCodeSchema,
  type AuthSchemaMessages
} from '@/features/authentication/model/schemas'

const messages: AuthSchemaMessages = {
  emailInvalid: 'EMAIL_INVALID',
  passwordRequired: 'PASSWORD_REQUIRED',
  passwordTooShort: 'PASSWORD_TOO_SHORT',
  passwordTooLong: 'PASSWORD_TOO_LONG',
  nameTooShort: 'NAME_TOO_SHORT',
  nameTooLong: 'NAME_TOO_LONG',
  codeLength: 'CODE_LENGTH',
  codeNumeric: 'CODE_NUMERIC',
  passwordsDontMatch: 'PASSWORDS_DONT_MATCH'
}

function firstIssue(result: {
  success: false
  error: { issues: Array<{ message: string; path: (string | number)[] }> }
}) {
  return result.error.issues[0]
}

describe('createSignInSchema', () => {
  const schema = createSignInSchema(messages)

  it('accepts a valid email and password', () => {
    expect(schema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = schema.safeParse({ email: 'not-an-email', password: 'x' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('EMAIL_INVALID')
    }
  })

  it('rejects an empty password', () => {
    const result = schema.safeParse({ email: 'a@b.co', password: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('PASSWORD_REQUIRED')
    }
  })
})

describe('createSignUpSchema', () => {
  const schema = createSignUpSchema(messages)

  it('accepts a valid payload', () => {
    expect(schema.safeParse({ name: 'Bryan', email: 'a@b.co', password: 'longenough' }).success).toBe(true)
  })

  it('trims the name before validating its length', () => {
    expect(schema.safeParse({ name: '  Bryan  ', email: 'a@b.co', password: 'longenough' }).success).toBe(true)
    expect(schema.safeParse({ name: '   A   ', email: 'a@b.co', password: 'longenough' }).success).toBe(false)
  })

  it('rejects a name shorter than 2 chars', () => {
    const result = schema.safeParse({ name: 'A', email: 'a@b.co', password: 'longenough' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('NAME_TOO_SHORT')
    }
  })

  it('rejects a name longer than 50 chars', () => {
    const result = schema.safeParse({ name: 'A'.repeat(51), email: 'a@b.co', password: 'longenough' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('NAME_TOO_LONG')
    }
  })

  it('rejects a password shorter than 8 chars', () => {
    const result = schema.safeParse({ name: 'Bryan', email: 'a@b.co', password: '1234567' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('PASSWORD_TOO_SHORT')
    }
  })

  it('rejects a password longer than 72 chars', () => {
    const result = schema.safeParse({ name: 'Bryan', email: 'a@b.co', password: 'x'.repeat(73) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('PASSWORD_TOO_LONG')
    }
  })
})

describe('createVerifyCodeSchema', () => {
  const schema = createVerifyCodeSchema(messages)

  it('accepts a 6-digit numeric code', () => {
    expect(schema.safeParse({ code: '123456' }).success).toBe(true)
  })

  it('rejects a code shorter than 6 chars', () => {
    expect(schema.safeParse({ code: '12345' }).success).toBe(false)
  })

  it('rejects a code longer than 6 chars', () => {
    expect(schema.safeParse({ code: '1234567' }).success).toBe(false)
  })

  it('rejects a 6-char code with non-digit characters', () => {
    const result = schema.safeParse({ code: '12345a' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('CODE_NUMERIC')
    }
  })
})

describe('createForgotPasswordSchema', () => {
  const schema = createForgotPasswordSchema(messages)

  it('accepts a valid email', () => {
    expect(schema.safeParse({ email: 'a@b.co' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = schema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssue(result).message).toBe('EMAIL_INVALID')
    }
  })
})

describe('createResetPasswordSchema', () => {
  const schema = createResetPasswordSchema(messages)

  it('accepts matching valid passwords', () => {
    expect(schema.safeParse({ password: 'longenough', confirmPassword: 'longenough' }).success).toBe(true)
  })

  it('rejects when the confirmPassword does not match', () => {
    const result = schema.safeParse({ password: 'longenough', confirmPassword: 'different1' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const mismatch = result.error.issues.find((i) => i.message === 'PASSWORDS_DONT_MATCH')
      expect(mismatch).toBeDefined()
      expect(mismatch?.path).toEqual(['confirmPassword'])
    }
  })

  it('rejects when the password is too short', () => {
    const result = schema.safeParse({ password: 'short', confirmPassword: 'short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const tooShort = result.error.issues.find((i) => i.message === 'PASSWORD_TOO_SHORT')
      expect(tooShort).toBeDefined()
    }
  })
})
