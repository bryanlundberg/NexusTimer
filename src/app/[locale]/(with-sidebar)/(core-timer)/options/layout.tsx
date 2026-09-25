import React from 'react'
import type { Metadata } from 'next'
import { localizedPathMetadata } from '@/shared/config/i18n/pageMetadata'

export function generateMetadata(): Promise<Metadata> {
  return localizedPathMetadata('/options')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
