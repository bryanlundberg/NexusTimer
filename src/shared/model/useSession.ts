'use client'

import { authClient } from '@/shared/config/auth/auth-client'

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useSession() {
  const { data, isPending, refetch } = authClient.useSession()
  const status: SessionStatus = data ? 'authenticated' : isPending ? 'loading' : 'unauthenticated'
  const update = () => refetch({ query: { disableCookieCache: true } })

  return { data, status, update }
}
