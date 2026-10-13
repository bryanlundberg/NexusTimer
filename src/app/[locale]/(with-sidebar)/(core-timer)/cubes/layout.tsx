import React from 'react'
import type { Metadata } from 'next'
import { noIndexPathMetadata } from '@/shared/config/i18n/pageMetadata'

export function generateMetadata(): Promise<Metadata> {
  return noIndexPathMetadata('/cubes')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
