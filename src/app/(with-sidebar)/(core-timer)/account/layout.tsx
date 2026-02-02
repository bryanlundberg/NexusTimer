import { ScrollArea } from '@/components/ui/scroll-area'
import { auth } from '@/shared/config/auth/auth'
import AccountNotAuth from '@/features/account/ui/account-not-auth'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user.id) return <AccountNotAuth />

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <div className="mx-auto bg-background/90 backdrop-blur-lg pb-5">{children}</div>
    </ScrollArea>
  )
}
