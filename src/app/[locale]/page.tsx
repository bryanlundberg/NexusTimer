import type { Metadata } from 'next'
import { getLocale, getMessages } from 'next-intl/server'
import { localizedAlternates } from '@/shared/config/i18n/alternates'
import { landingMessages } from '@/shared/config/i18n/messageScopes'
import { MessagesScope } from '@/shared/ui/messages-scope/MessagesScope'
import LandingShell from '@/widgets/landing/ui/LandingShell'
import FrameFooter from '@/widgets/landing/ui/FrameFooter'
import FaqJsonLd from '@/widgets/landing/ui/FaqJsonLd'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    alternates: localizedAlternates(locale, '/')
  }
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
