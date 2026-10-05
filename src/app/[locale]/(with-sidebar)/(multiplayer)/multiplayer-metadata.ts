import type { Metadata } from 'next'
import { OG_IMAGES, ogImage } from '@/shared/config/seo/open-graph'

export const multiplayerOpenGraph = (image: string): NonNullable<Metadata['openGraph']> => ({
  title: 'Multiplayer Cubing - Nexus Timer',
  description: "Join real-time competitive Rubik's cube solving sessions with cubers worldwide.",
  type: 'website',
  images: [ogImage(image)]
})

export const multiplayerMetadata: Metadata = {
  title: 'Multiplayer Cubing - Nexus Timer',
  description:
    "Compete in real-time Rubik's cube solving sessions with cubers worldwide. Challenge friends, participate in group solves with synchronized timing.",
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
  openGraph: multiplayerOpenGraph(OG_IMAGES.multiplayer)
}
