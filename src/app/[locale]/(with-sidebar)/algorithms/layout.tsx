import React from 'react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { localizedAlternates } from '@/shared/config/i18n/alternates'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return {
    alternates: localizedAlternates(locale, '/algorithms')
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
