'use client'

import { useState } from 'react'
import { postJSON } from '@/features/authentication/model/api-client'
import type { VerifyCodeValues } from '@/features/authentication/model/schemas'
import { signInWithCredentials, type SignInResult } from '@/features/authentication/model/sign-in-credentials'

interface VerifyArgs {
  email: string
  password: string
  values: VerifyCodeValues
}

export function useVerifyCode() {
  const [isLoading, setIsLoading] = useState(false)

  const verify = async ({ email, password, values }: VerifyArgs): Promise<SignInResult> => {
    setIsLoading(true)
    try {
      const result = await postJSON('/api/v1/auth/verify-code', { email, code: values.code })
      if (!result.ok) return result
      return await signInWithCredentials(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return { verify, isLoading }
}
