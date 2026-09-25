import type { Metadata } from 'next'
import { redirect } from '@/shared/config/i18n/navigation'
import { getLocale } from 'next-intl/server'
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
  if (!session?.user?.id) redirect({ href: '/sign-in', locale: await getLocale() })

  return <MessagesShell>{children}</MessagesShell>
}
