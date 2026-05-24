'use client'

import { postJSON, type ApiResult } from '@/features/authentication/model/api-client'
import { useAsyncAction } from './use-async-action'

interface ResetPasswordArgs {
  oobCode: string
  password: string
}

export function useResetPassword() {
  const { run, isLoading } = useAsyncAction((args: ResetPasswordArgs): Promise<ApiResult<{ email: string }>> => {
    return postJSON<{ email: string }>('/api/v1/auth/reset-password', args)
  })

  return { reset: run, isLoading }
}
