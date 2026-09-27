'use client'

import { signIn } from 'next-auth/react'

interface Props {
  provider: string
  label: string
  brand?: string
  children: React.ReactNode
}

export default function OAuthIconButton({ provider, label, brand = 'var(--primary)', children }: Props) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider)}
      aria-label={label}
      title={label}
      data-brand
      style={{ '--brand': brand } as React.CSSProperties}
      className="btn-notch btn-notch-border relative flex h-11 flex-1 items-center justify-center outline-none transition-transform duration-150 active:scale-[0.97] [&_img]:transition-transform hover:[&_img]:scale-110 focus-visible:[&_img]:scale-110 motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}
