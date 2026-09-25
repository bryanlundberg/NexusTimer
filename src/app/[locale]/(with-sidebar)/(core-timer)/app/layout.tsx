import React from 'react'
import type { Metadata } from 'next'
import { localizedPageMetadata } from '@/shared/config/i18n/pageMetadata'

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('timer', '/app')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
