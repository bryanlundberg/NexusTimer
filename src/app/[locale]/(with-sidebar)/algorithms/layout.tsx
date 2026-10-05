import React from 'react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { localizedAlternates } from '@/shared/config/i18n/alternates'
import { OG_IMAGES, siteOpenGraph } from '@/shared/config/seo/open-graph'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    alternates: localizedAlternates(locale, '/algorithms'),
    openGraph: await siteOpenGraph(OG_IMAGES.algorithms)
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
