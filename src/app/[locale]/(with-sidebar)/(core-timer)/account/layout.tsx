import type { Metadata } from 'next'
import { ScrollArea } from '@/components/ui/scroll-area'
import AccountNotAuth from '@/features/account/ui/account-not-auth'
import RequireSession from '@/features/authentication/ui/RequireSession'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession fallback={<AccountNotAuth />}>
      <ScrollArea className={'max-h-dvh overflow-auto'}>
        <div className="mx-auto bg-background/90 backdrop-blur-lg pb-5">{children}</div>
      </ScrollArea>
    </RequireSession>
  )
}
