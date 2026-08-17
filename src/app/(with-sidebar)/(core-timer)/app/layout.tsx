import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/app'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
