import { z } from 'zod'

export interface AuthSchemaMessages {
  emailInvalid: string
  passwordRequired: string
  passwordTooShort: string
  passwordTooLong: string
  nameTooShort: string
  nameTooLong: string
  codeLength: string
  codeNumeric: string
  passwordsDontMatch: string
}

export function createSignInSchema(messages: AuthSchemaMessages) {
  return z.object({
    email: z.string().email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired)
  })
}

export function createSignUpSchema(messages: AuthSchemaMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.nameTooShort).max(50, messages.nameTooLong),
    email: z.string().email(messages.emailInvalid),
    password: z.string().min(8, messages.passwordTooShort).max(72, messages.passwordTooLong)
  })
}

export function createVerifyCodeSchema(messages: AuthSchemaMessages) {
  return z.object({
    code: z
      .string()
      .length(6, messages.codeLength)
      .regex(/^\d{6}$/, messages.codeNumeric)
  })
}

export function createForgotPasswordSchema(messages: AuthSchemaMessages) {
  return z.object({
    email: z.string().email(messages.emailInvalid)
  })
}

export function createResetPasswordSchema(messages: AuthSchemaMessages) {
  return z
    .object({
      password: z.string().min(8, messages.passwordTooShort).max(72, messages.passwordTooLong),
      confirmPassword: z.string()
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: messages.passwordsDontMatch,
      path: ['confirmPassword']
    })
}

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>
export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>
export type VerifyCodeValues = z.infer<ReturnType<typeof createVerifyCodeSchema>>
export type ForgotPasswordValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>
export type ResetPasswordValues = z.infer<ReturnType<typeof createResetPasswordSchema>>
