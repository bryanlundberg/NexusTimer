import type { Metadata } from 'next'
import { auth } from '@/shared/config/auth/auth'
import AccountNotAuth from '@/features/account/ui/account-not-auth'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function FriendsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) return <AccountNotAuth />

  return <>{children}</>
}
