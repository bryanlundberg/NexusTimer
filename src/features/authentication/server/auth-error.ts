export type AuthErrorCode = 'invalid-input' | 'email-in-use' | 'invalid-or-expired-code' | 'code-expired' | 'internal'

const STATUS_BY_CODE: Record<AuthErrorCode, number> = {
  'invalid-input': 400,
  'email-in-use': 409,
  'invalid-or-expired-code': 400,
  'code-expired': 400,
  internal: 500
}

export class AuthError extends Error {
  readonly code: AuthErrorCode
  readonly status: number

  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
    this.status = STATUS_BY_CODE[code]
    this.name = 'AuthError'
  }
}
