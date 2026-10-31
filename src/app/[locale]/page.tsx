import type { Metadata } from 'next'
import { getMessages } from 'next-intl/server'
import { localizedPageMetadata } from '@/shared/config/i18n/pageMetadata'
import { landingMessages } from '@/shared/config/i18n/messageScopes'
import { MessagesScope } from '@/shared/ui/messages-scope/MessagesScope'
import LandingShell from '@/widgets/landing/ui/LandingShell'
import FrameFooter from '@/widgets/landing/ui/FrameFooter'
import FaqJsonLd from '@/widgets/landing/ui/FaqJsonLd'

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('home', '/')
}

export default async function Page() {
  const messages = await getMessages()

  return (
    <MessagesScope messages={landingMessages(messages)}>
      <FaqJsonLd />
      <LandingShell footer={<FrameFooter />} />
    </MessagesScope>
  )
}
