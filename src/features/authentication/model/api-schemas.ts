import { z } from 'zod'
import { codeAtom, emailAtom, nameAtom, passwordAtom } from './atoms'

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
