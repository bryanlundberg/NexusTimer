import type { Metadata } from 'next'
import RequireSession from '@/features/authentication/ui/RequireSession'
import { MessagesShell } from '@/widgets/chat/ui/MessagesShell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession>
      <MessagesShell>{children}</MessagesShell>
    </RequireSession>
  )
}
