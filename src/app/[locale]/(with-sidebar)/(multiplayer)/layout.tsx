import React from 'react'
import { Metadata } from 'next'
import { localizedPathMetadata } from '@/shared/config/i18n/pageMetadata'
import { multiplayerMetadata } from './multiplayer-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return { ...multiplayerMetadata, ...(await localizedPathMetadata('/free-play')) }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
