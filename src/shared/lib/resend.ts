import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
