'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import type { SignInValues, SignUpValues, VerifyCodeValues } from './schemas'

type Result = { ok: true } | { ok: false; message: string }

async function postJSON(url: string, body: unknown): Promise<Result & { data?: unknown }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, message: (data?.message as string) ?? (data?.error as string) ?? 'Request failed' }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'Network error' }
  }
}

async function signInCredentials(email: string, password: string): Promise<Result> {
  try {
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) return { ok: false, message: 'Invalid email or password' }
    return { ok: true }
  } catch {
    return { ok: false, message: 'Invalid email or password' }
  }
}

export function useCredentialsLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (values: SignInValues): Promise<Result> => {
    setIsLoading(true)
    const result = await signInCredentials(values.email, values.password)
    setIsLoading(false)
    return result
  }

  return { login, isLoading }
}

export function useCredentialsRegister() {
  const [isLoading, setIsLoading] = useState(false)

  const register = async (values: SignUpValues): Promise<Result> => {
    setIsLoading(true)
    const result = await postJSON('/api/v1/auth/register', values)
    setIsLoading(false)
    return result
  }

  return { register, isLoading }
}

export function useVerifyCode() {
  const [isLoading, setIsLoading] = useState(false)

  const verify = async (email: string, password: string, values: VerifyCodeValues): Promise<Result> => {
    setIsLoading(true)
    const result = await postJSON('/api/v1/auth/verify-code', { email, code: values.code })
    if (!result.ok) {
      setIsLoading(false)
      return result
    }
    const signInResult = await signInCredentials(email, password)
    setIsLoading(false)
    return signInResult
  }

  return { verify, isLoading }
}

export function useResendCode() {
  const [isLoading, setIsLoading] = useState(false)

  const resend = async (email: string): Promise<Result> => {
    setIsLoading(true)
    const result = await postJSON('/api/v1/auth/resend-verification', { email })
    setIsLoading(false)
    return result
  }

  return { resend, isLoading }
}
