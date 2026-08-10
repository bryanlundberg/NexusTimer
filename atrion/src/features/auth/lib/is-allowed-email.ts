import { ALLOWED_EMAIL } from 'astro:env/server'

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === ALLOWED_EMAIL.trim().toLowerCase()
}
