import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { localizedAlternates } from '@/shared/config/i18n/alternates'
import LandingShell from '@/widgets/landing/ui/LandingShell'
import LandingFooter from '@/widgets/landing/ui/LandingFooter'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    alternates: localizedAlternates(locale, '/')
  }
}

export default function Page() {
  return <LandingShell footer={<LandingFooter />} />
}
