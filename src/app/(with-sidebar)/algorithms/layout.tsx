import React from 'react'
import type { Metadata } from 'next'
import { locales } from '@/shared/config/i18n/locales'

export const metadata: Metadata = {
  alternates: {
    canonical: '/algorithms',
    languages: Object.fromEntries(locales.map((l) => [l, '/algorithms']))
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
