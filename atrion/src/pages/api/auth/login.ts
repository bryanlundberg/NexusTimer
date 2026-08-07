import type { APIRoute } from 'astro'
import { verifyPassword } from '@/features/auth/api/verify-password'
import { setSessionCookie } from '@/features/auth/model/session'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData()
  const email = String(form.get('email') ?? '')
  const password = String(form.get('password') ?? '')

  if (!email || !password) return redirect('/auth?error=missing')

  try {
    const user = await verifyPassword(email, password)
    if (!user) return redirect('/auth?error=credentials')

    await setSessionCookie(cookies, user)
    return redirect('/')
  } catch (error) {
    console.error('[auth] password sign-in failed:', error)
    return redirect('/auth?error=server')
  }
}
