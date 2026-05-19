'use client'
import { signIn } from 'next-auth/react'
import { UserRound } from 'lucide-react'

export default function DevLogin() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <button
      type="button"
      onClick={() => signIn('dev-login')}
      aria-label="Continue as guest"
      title="Continue as guest"
      className="size-11 rounded-full border bg-background hover:bg-muted hover:scale-105 active:scale-95 transition flex items-center justify-center"
    >
      <UserRound className="size-5" />
    </button>
  )
}
