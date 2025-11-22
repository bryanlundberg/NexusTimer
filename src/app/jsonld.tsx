import { locales } from '@/shared/config/i18n/locales'

interface JsonLdProps {
  locale: string
  title: string
  description: string
  url: string
}

export default function JsonLd({ locale, title, description, url }: JsonLdProps) {
  const inLanguage = locale
  const alternateLanguages = locales
    .filter((l) => l !== locale)
    .map((l) => ({
      '@type': 'Language',
      name: l,
      alternateName: l
    }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: description,
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    inLanguage: inLanguage,
    availableLanguage: alternateLanguages,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Organization',
      name: 'Nexus Timer',
      url: 'https://nexustimer.com'
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://nexustimer.com',
        inLanguage: inLanguage
      }
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
