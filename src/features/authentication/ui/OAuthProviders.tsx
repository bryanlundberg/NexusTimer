'use client'

import GoogleButton from '@/features/authentication/ui/GoogleButton'
import DiscordButton from '@/features/authentication/ui/DiscordButton'
import DevLogin from '@/features/authentication/ui/DevLogin'

export default function OAuthProviders() {
  return (
    <div className="flex items-center justify-center gap-3">
      <GoogleButton />
      <DiscordButton />
      <DevLogin />
    </div>
  )
}
