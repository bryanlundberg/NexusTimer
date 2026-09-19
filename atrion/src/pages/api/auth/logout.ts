import type { APIRoute } from 'astro'
import { clearSessionCookie } from '@/features/auth/model/session'

export const prerender = false

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearSessionCookie(cookies)
  return redirect('/auth')
}
