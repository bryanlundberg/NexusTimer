'use client'

import { signIn } from 'next-auth/react'

export type SignInResult = { ok: true } | { ok: false; message: string }

export async function signInWithCredentials(email: string, password: string): Promise<SignInResult> {
  try {
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) return { ok: false, message: 'Invalid email or password' }
    return { ok: true }
  } catch {
    return { ok: false, message: 'Invalid email or password' }
  }
}
