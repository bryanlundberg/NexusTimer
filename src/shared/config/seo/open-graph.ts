import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

type OpenGraph = NonNullable<Metadata['openGraph']>

export const OG_IMAGES = {
  site: '/opengraph-image.png',
  algorithms: '/og/algorithms.png',
  multiplayer: '/og/multiplayer.png',
  freePlayRoom: '/og/free-play-room.png'
} as const

export const ogImage = (url: string, alt?: string) => ({ url, width: 1200, height: 630, ...(alt ? { alt } : {}) })

export async function siteOpenGraph(image: string = OG_IMAGES.site): Promise<OpenGraph> {
  const locale = await getLocale()
  const t = await getTranslations('Metadata')
  const title = t('title')

  return {
    title,
    description: t('description'),
    url: 'https://nexustimer.com',
    siteName: 'Nexus Timer',
    locale,
    type: 'website',
    images: [ogImage(image, title)]
  }
}
