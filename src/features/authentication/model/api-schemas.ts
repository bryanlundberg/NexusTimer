import { z } from 'zod'

export const registerRequestSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(72)
})

export const verifyCodeRequestSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .length(6)
    .regex(/^\d{6}$/)
})

export const resendRequestSchema = z.object({
  email: z.string().email()
})

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email()
})

export const resetPasswordRequestSchema = z.object({
  oobCode: z.string().min(1),
  password: z.string().min(8).max(72)
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type VerifyCodeRequest = z.infer<typeof verifyCodeRequestSchema>
export type ResendRequest = z.infer<typeof resendRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>
