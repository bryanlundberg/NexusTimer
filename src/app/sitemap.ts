import { locales } from '@/shared/config/i18n/locales'
import { MetadataRoute } from 'next'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

const host = 'https://nexustimer.com'

export default function sitemap(): MetadataRoute.Sitemap {
  function generateAlternates(path: string) {
    return {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${host}${path}`]))
    }
  }

  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/app', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/people', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/free-play', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/solves', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/stats', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/cubes', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/transfer-solves', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/options', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/terms-of-service', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/algorithms', priority: 0.9, changeFrequency: 'weekly' as const },
    ...ALGORITHM_SETS.map((set) => ({
      priority: 0.9,
      path: `/algorithms/${set.slug.toLowerCase()}`,
      changeFrequency: 'weekly' as const
    }))
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []
  const buildDate = new Date()

  pages.forEach(({ path, priority, changeFrequency }) => {
    sitemapEntries.push({
      url: `${host}${path}`,
      lastModified: buildDate,
      changeFrequency,
      priority,
      alternates: generateAlternates(path)
    })
  })

  return sitemapEntries
}
