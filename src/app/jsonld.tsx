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
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
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
      url: 'https://nexustimer.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nexustimer.com/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexus Timer',
      url: 'https://nexustimer.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nexustimer.com/logo.png'
      }
    },
    image: 'https://nexustimer.com/opengraph-image.png',
    screenshot: 'https://nexustimer.com/app-desktop-view.png',
    featureList: [
      "Rubik's Cube Timer",
      'Speedcubing Statistics',
      'Algorithm Trainer',
      'Multiplayer Mode',
      'Cloud Sync',
      'Cross-platform Support'
    ],
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://nexustimer.com/app',
        inLanguage: inLanguage,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform']
      }
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
