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

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>
export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>
export type VerifyCodeValues = z.infer<ReturnType<typeof createVerifyCodeSchema>>
