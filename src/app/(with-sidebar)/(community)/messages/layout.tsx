import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/shared/config/auth/auth'
import { MessagesShell } from '@/widgets/chat/ui/MessagesShell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  return <MessagesShell>{children}</MessagesShell>
}
