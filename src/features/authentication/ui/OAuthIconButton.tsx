'use client'

import { signIn } from 'next-auth/react'

interface Props {
  provider: string
  label: string
  children: React.ReactNode
}

export default function OAuthIconButton({ provider, label, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider)}
      aria-label={label}
      title={label}
      className="size-11 rounded-full border bg-background hover:bg-muted hover:scale-105 active:scale-95 transition flex items-center justify-center"
    >
      {children}
    </button>
  )
}
