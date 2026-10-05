import type { Metadata } from 'next'
import { STATIC_ROUTE_PLACEHOLDER } from '@nexustimer/contracts'
import { OG_IMAGES } from '@/shared/config/seo/open-graph'
import { multiplayerOpenGraph } from '../../multiplayer-metadata'

export const metadata: Metadata = {
  openGraph: multiplayerOpenGraph(OG_IMAGES.freePlayRoom),
  robots: {
    index: false,
    follow: false
  }
}

export function generateStaticParams() {
  return [{ roomId: STATIC_ROUTE_PLACEHOLDER }]
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
