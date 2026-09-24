import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createTranslator } from 'next-intl'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { locales } from '@/shared/config/i18n/locales'

const load = (locale: string): IntlMessages =>
  JSON.parse(readFileSync(path.resolve(__dirname, `../messages/${locale}.json`), 'utf8'))

describe.each(locales)('algorithm set guides (%s)', (locale) => {
  const messages = load(locale)
  const t = createTranslator({ locale, messages, namespace: 'Index.AlgorithmsPage' })

  it.each(ALGORITHM_SETS.map((set) => set.slug))('has a translated guide for %s', (slug) => {
    expect(t(`guides.${slug}.when`)).not.toContain('guides.')
    expect(t(`guides.${slug}.learn`)).not.toContain('guides.')
    expect(t(`descriptions.${slug}`)).not.toContain('descriptions.')
  })

  it('formats the guide questions for every count', () => {
    for (const count of [1, 2, 5, 21, 72]) {
      const answer = t('guide.count-answer', { title: 'OLL', count, puzzle: '3x3x3' })
      expect(answer).toContain(String(count))
      expect(answer).toContain('OLL')
    }
    expect(t('guide.heading', { title: 'OLL' })).toContain('OLL')
  })

  it('does not use em dashes in the guides', () => {
    const { guide, guides } = messages.Index.AlgorithmsPage
    expect(JSON.stringify([guide, guides])).not.toContain('—')
  })
})
