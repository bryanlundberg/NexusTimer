import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Versus - Nexus Timer',
  description:
    'Local head-to-head speedcubing on a single device. Split the screen between 2, 3 or 4 players, share the same scramble and race offline.',
  keywords: [
    'versus cubing',
    'split screen timer',
    'local multiplayer cube timer',
    'cube race offline',
    'head to head speedcubing',
    'shared device timer',
    'rubiks cube timer',
    'nexus timer'
  ],
  openGraph: {
    title: 'Versus - Nexus Timer',
    description: 'Split one phone between 2 to 4 cubers and race on the same scramble.',
    type: 'website'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
