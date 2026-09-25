import type { Metadata } from 'next'
import { localizedPageMetadata } from '@/shared/config/i18n/pageMetadata'

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('community', '/people')
}

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
