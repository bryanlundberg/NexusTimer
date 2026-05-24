'use client'

import type { SignInValues } from '@/features/authentication/model/schemas'
import { signInWithCredentials, type SignInResult } from '@/features/authentication/model/sign-in-credentials'
import { useAsyncAction } from './use-async-action'

export function useCredentialsLogin() {
  const { run, isLoading } = useAsyncAction((values: SignInValues): Promise<SignInResult> => {
    return signInWithCredentials(values.email, values.password)
  })

  return { login: run, isLoading }
}
