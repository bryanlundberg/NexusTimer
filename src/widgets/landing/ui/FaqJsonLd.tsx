import { getLocale, getTranslations } from 'next-intl/server'
import { FAQ_COUNT } from '../lib/faq'

export default async function FaqJsonLd() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.faq' })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: Array.from({ length: FAQ_COUNT }, (_, i) => ({
      '@type': 'Question',
      name: t(`q${i + 1}`),
      acceptedAnswer: { '@type': 'Answer', text: t(`a${i + 1}`) }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  )
}
