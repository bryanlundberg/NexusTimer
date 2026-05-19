'use client'

import { postJSON, type ApiResult } from '@/features/authentication/model/api-client'
import type { SignUpValues } from '@/features/authentication/model/schemas'
import { useAsyncAction } from './use-async-action'

export function useCredentialsRegister() {
  const { run, isLoading } = useAsyncAction((values: SignUpValues): Promise<ApiResult> => {
    return postJSON('/api/v1/auth/register', values)
  })

  return { register: run, isLoading }
}
