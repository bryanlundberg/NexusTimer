'use client'

import { UserRound } from 'lucide-react'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'
import { signInAsDevUser } from '@/features/authentication/model/sign-in-social'

export default function DevLogin() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <OAuthIconButton label="Continue as guest" onClick={signInAsDevUser}>
      <UserRound className="size-5" />
    </OAuthIconButton>
  )
}
