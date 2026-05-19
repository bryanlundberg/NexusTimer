'use client'

import { postJSON, type ApiResult } from '@/features/authentication/model/api-client'
import { useAsyncAction } from './use-async-action'

export function useResendCode() {
  const { run, isLoading } = useAsyncAction((email: string): Promise<ApiResult> => {
    return postJSON('/api/v1/auth/resend-verification', { email })
  })

  return { resend: run, isLoading }
}
