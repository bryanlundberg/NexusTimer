import { MetadataRoute } from 'next'
import { locales, localizedPath } from '@/shared/config/i18n/locales'

const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'Amazonbot',
  'Google-Extended',
  'Applebot-Extended'
]

const NOT_INDEXED = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/account$',
  '/account/',
  '/messages',
  '/friends',
  '/free-play/',
  '/people',
  '/algorithms/trainer/history',
  '/~offline'
]

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', ...locales.flatMap((locale) => NOT_INDEXED.map((path) => localizedPath(locale, path)))]
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: '/'
      }
    ],
    sitemap: 'https://nexustimer.com/sitemap.xml',
    host: 'https://nexustimer.com'
  }
}
