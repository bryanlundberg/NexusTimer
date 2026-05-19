'use client'

import { postJSON, type ApiResult } from '@/features/authentication/model/api-client'
import type { ForgotPasswordValues } from '@/features/authentication/model/schemas'
import { useAsyncAction } from './use-async-action'

export function useForgotPassword() {
  const { run, isLoading } = useAsyncAction((values: ForgotPasswordValues): Promise<ApiResult> => {
    return postJSON('/api/v1/auth/forgot-password', values)
  })

  return { request: run, isLoading }
}
