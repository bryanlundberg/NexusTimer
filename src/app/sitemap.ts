import { MetadataRoute } from 'next'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { locales, localizedPath } from '@/shared/config/i18n/locales'

const host = 'https://nexustimer.com'

const ENGLISH_ONLY = new Set(['/about-us', '/contact-us', '/account-deletion', '/privacy-policy', '/terms-of-service'])

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' as const },
    { path: '/app', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/leaderboards', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/free-play', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/solves', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/stats', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/cubes', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/transfer-solves', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/options', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about-us', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact-us', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/account-deletion', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/privacy-policy', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/terms-of-service', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/algorithms', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/algorithms/trainer', priority: 0.9, changeFrequency: 'monthly' as const },
    ...ALGORITHM_SETS.map((set) => ({
      priority: 0.9,
      path: `/algorithms/${set.slug.toLowerCase()}`,
      changeFrequency: 'monthly' as const
    }))
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  pages.forEach(({ path, priority, changeFrequency }) => {
    if (ENGLISH_ONLY.has(path)) {
      sitemapEntries.push({ url: `${host}${path}`, changeFrequency, priority })
      return
    }

    const alternates = {
      languages: {
        ...Object.fromEntries(locales.map((code) => [code, `${host}${localizedPath(code, path)}`])),
        'x-default': `${host}${path}`
      }
    }

    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${host}${localizedPath(locale, path)}`,
        changeFrequency,
        priority,
        alternates
      })
    })
  })

  return sitemapEntries
}
