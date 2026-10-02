'use client'

import { authClient } from '@/shared/config/auth/auth-client'
import { DEV_LOGIN_PATH } from '@/shared/config/auth/constants'

export type SocialProvider = 'google' | 'discord'

export function signInWithProvider(provider: SocialProvider) {
  const callbackURL = window.location.pathname + window.location.search
  return authClient.signIn.social({ provider, callbackURL, errorCallbackURL: '/sign-in' })
}

export async function signInAsDevUser() {
  const { error } = await authClient.$fetch(DEV_LOGIN_PATH, { method: 'POST' })
  if (error) return
  window.location.assign('/app')
}
