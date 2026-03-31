import type { Metadata } from 'next'
import { locales } from '@/shared/config/i18n/locales'

export const metadata: Metadata = {
  alternates: {
    canonical: '/people',
    languages: Object.fromEntries(locales.map((l) => [l, '/people']))
  }
}

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
