import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import sitemap from '@/app/sitemap'
import { locales } from '@/shared/config/i18n/locales'

const messagesDir = path.resolve(__dirname, '../messages')
const seoPages = ['timer', 'leaderboards', 'community', 'trainer']

describe.each(readdirSync(messagesDir).filter((file) => file.endsWith('.json')))('seo page metadata (%s)', (file) => {
  const pages = JSON.parse(readFileSync(path.join(messagesDir, file), 'utf8')).Metadata?.pages

  it.each(seoPages)('has a title and a description that fits in search results for %s', (page) => {
    expect(pages?.[page]?.title).toBeTruthy()
    expect(pages?.[page]?.description).toBeTruthy()
    expect([...pages[page].description].length).toBeLessThanOrEqual(160)
  })
})

describe('sitemap', () => {
  const entries = sitemap()
  const byUrl = (url: string) => entries.filter((entry) => entry.url === url)

  it('lists english-only pages once and without language alternates', () => {
    const privacy = byUrl('https://nexustimer.com/privacy-policy')

    expect(privacy).toHaveLength(1)
    expect(privacy[0].alternates).toBeUndefined()
    expect(entries.some((entry) => entry.url === 'https://nexustimer.com/es/privacy-policy')).toBe(false)
  })

  it('lists translated pages in every locale with hreflang alternates', () => {
    const trainerUrls = entries.filter((entry) => entry.url.endsWith('/algorithms/trainer'))

    expect(trainerUrls).toHaveLength(locales.length)
    expect(byUrl('https://nexustimer.com/es/algorithms/trainer')[0].alternates?.languages).toMatchObject({
      en: 'https://nexustimer.com/algorithms/trainer',
      es: 'https://nexustimer.com/es/algorithms/trainer',
      'x-default': 'https://nexustimer.com/algorithms/trainer'
    })
  })
})
