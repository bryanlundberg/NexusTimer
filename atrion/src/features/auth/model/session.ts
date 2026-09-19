import { SignJWT, jwtVerify } from 'jose'
import type { AstroCookies } from 'astro'
import { AUTH_SECRET } from 'astro:env/server'

export const SESSION_COOKIE = 'atrion_session'
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60

export interface SessionUser {
  id: string
  email: string
  name: string
  image: string
}

function secret(): Uint8Array {
  return new TextEncoder().encode(AUTH_SECRET)
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, image: user.image })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret())
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (!payload.sub || typeof payload.email !== 'string') return null
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : '',
      image: typeof payload.image === 'string' ? payload.image : ''
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(cookies: AstroCookies, user: SessionUser): Promise<void> {
  cookies.set(SESSION_COOKIE, await signSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: MAX_AGE_SECONDS
  })
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' })
}

export async function readSession(cookies: AstroCookies): Promise<SessionUser | null> {
  const token = cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySession(token)
}
