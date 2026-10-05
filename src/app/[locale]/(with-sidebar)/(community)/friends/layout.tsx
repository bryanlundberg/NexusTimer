import type { Metadata } from 'next'
import RequireSession from '@/features/authentication/ui/RequireSession'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return <RequireSession>{children}</RequireSession>
}
