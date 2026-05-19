'use client'

import { UserRound } from 'lucide-react'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'

export default function DevLogin() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <OAuthIconButton provider="dev-login" label="Continue as guest">
      <UserRound className="size-5" />
    </OAuthIconButton>
  )
}
