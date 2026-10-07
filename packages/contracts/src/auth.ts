import * as z from 'zod'

export const DEV_LOGIN_PATH = '/dev-login'

export const AUTH_COOKIE_PREFIX = 'better-auth'
export const SESSION_COOKIE = `${AUTH_COOKIE_PREFIX}.session_token`

export const emailAtom = (msg?: string) => z.string().trim().toLowerCase().pipe(z.email(msg))

export const passwordAtom = (msgs?: { tooShort?: string; tooLong?: string }) =>
  z.string().min(8, msgs?.tooShort).max(72, msgs?.tooLong)

export const passwordRequiredAtom = (msg?: string) => z.string().min(1, msg)

export const codeAtom = (msgs?: { length?: string; numeric?: string }) =>
  z
    .string()
    .length(6, msgs?.length)
    .regex(/^\d{6}$/, msgs?.numeric)

export const nameAtom = (msgs?: { tooShort?: string; tooLong?: string }) =>
  z.string().trim().min(2, msgs?.tooShort).max(50, msgs?.tooLong)

export const registerRequestSchema = z.object({
  name: nameAtom(),
  email: emailAtom(),
  password: passwordAtom()
})

export const verifyCodeRequestSchema = z.object({
  email: emailAtom(),
  code: codeAtom()
})

export const resendRequestSchema = z.object({
  email: emailAtom()
})

export const forgotPasswordRequestSchema = z.object({
  email: emailAtom()
})

export const resetPasswordRequestSchema = z.object({
  oobCode: z.string().min(1),
  password: passwordAtom()
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type VerifyCodeRequest = z.infer<typeof verifyCodeRequestSchema>
export type ResendRequest = z.infer<typeof resendRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>

export type PasswordResetEmailResponse = { ok: true; email: string }
