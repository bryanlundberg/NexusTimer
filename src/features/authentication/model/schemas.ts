import { z } from 'zod'
import { codeAtom, emailAtom, nameAtom, passwordAtom, passwordRequiredAtom } from './atoms'

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

const passwordMsgs = (m: AuthSchemaMessages) => ({ tooShort: m.passwordTooShort, tooLong: m.passwordTooLong })
const nameMsgs = (m: AuthSchemaMessages) => ({ tooShort: m.nameTooShort, tooLong: m.nameTooLong })
const codeMsgs = (m: AuthSchemaMessages) => ({ length: m.codeLength, numeric: m.codeNumeric })

export function createSignInSchema(messages: AuthSchemaMessages) {
  return z.object({
    email: emailAtom(messages.emailInvalid),
    password: passwordRequiredAtom(messages.passwordRequired)
  })
}

export function createSignUpSchema(messages: AuthSchemaMessages) {
  return z.object({
    name: nameAtom(nameMsgs(messages)),
    email: emailAtom(messages.emailInvalid),
    password: passwordAtom(passwordMsgs(messages))
  })
}

export function createVerifyCodeSchema(messages: AuthSchemaMessages) {
  return z.object({
    code: codeAtom(codeMsgs(messages))
  })
}

export function createForgotPasswordSchema(messages: AuthSchemaMessages) {
  return z.object({
    email: emailAtom(messages.emailInvalid)
  })
}

export function createResetPasswordSchema(messages: AuthSchemaMessages) {
  return z
    .object({
      password: passwordAtom(passwordMsgs(messages)),
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
