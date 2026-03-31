import type { Metadata } from 'next'
import { locales } from '@/shared/config/i18n/locales'

type Props = { params: Promise<{ userId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  return {
    alternates: {
      canonical: `/people/${userId}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/people/${userId}`]))
    }
  }
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
