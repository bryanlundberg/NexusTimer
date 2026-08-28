import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/options'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
