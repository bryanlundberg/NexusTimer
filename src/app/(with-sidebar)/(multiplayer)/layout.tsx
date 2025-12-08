import React from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Metadata } from 'next'
import { AppSidebar } from '@/widgets/sidebar/ui/AppSidebar'
import StatisticsProvider from '@/components/statistics-provider';

export const metadata: Metadata = {
  title: 'Multiplayer Cubing - Nexus Timer',
  description:
    'Compete in real-time Rubik\'s cube solving sessions with cubers worldwide. Challenge friends, participate in group solves with synchronized timing.',
  keywords: [
    'multiplayer cubing',
    'cube racing',
    'speedcubing competition',
    'online cube battle',
    'group cube solving',
    'real-time speedsolving',
    'rubiks cube timer',
    'nexus timer',
    'competitive cubing',
    'cube solve challenges'
  ],
  openGraph: {
    title: 'Multiplayer Cubing - Nexus Timer',
    description: 'Join real-time competitive Rubik\'s cube solving sessions with cubers worldwide.',
    type: 'website'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
