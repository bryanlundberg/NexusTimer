'use client'

import { authClient } from '@/shared/config/auth/auth-client'

export type SignInResult = { ok: true } | { ok: false; message: string }

export async function signInWithCredentials(email: string, password: string): Promise<SignInResult> {
  try {
    const { error } = await authClient.signIn.email({ email, password })
    if (error) return { ok: false, message: 'Invalid email or password' }
    return { ok: true }
  } catch {
    return { ok: false, message: 'Invalid email or password' }
  }
}
