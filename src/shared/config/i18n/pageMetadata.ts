import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { localizedAlternates } from '@/shared/config/i18n/alternates'

export type SeoPage = 'timer' | 'leaderboards' | 'community' | 'trainer'

export async function localizedPathMetadata(path: string): Promise<Metadata> {
  return { alternates: localizedAlternates(await getLocale(), path) }
}

export async function localizedPageMetadata(page: SeoPage, path: string): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: `Metadata.pages.${page}` })

  return {
    title: { absolute: `${t('title')} - Nexus Timer` },
    description: t('description'),
    alternates: localizedAlternates(locale, path)
  }
}
