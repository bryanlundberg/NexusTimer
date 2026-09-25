import { locales } from '@/shared/config/i18n/locales'

interface JsonLdProps {
  locale: string
  title: string
  description: string
  url: string
}

export default function JsonLd({ locale, title, description, url }: JsonLdProps) {
  const availableLanguages = locales.map((l) => ({
    '@type': 'Language',
    name: l,
    alternateName: l
  }))

  const organization = {
    '@type': 'Organization',
    '@id': 'https://nexustimer.com/#organization',
    name: 'Nexus Timer',
    alternateName: 'nxtimer',
    url: 'https://nexustimer.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://nexustimer.com/logo.png',
      width: 512,
      height: 512
    },
    sameAs: ['https://github.com/bryanlundberg/NexusTimer']
  }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': `${url}/#webapp`,
      name: title,
      description: description,
      url: url,
      applicationCategory: 'UtilityApplication',
      applicationSubCategory: 'Speedcubing Timer',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      inLanguage: locale,
      availableLanguage: availableLanguages,
      keywords: [
        'rubiks cube timer',
        'speedcubing',
        'cube timer online',
        'puzzle timer',
        'cubing statistics',
        'WCA scrambles',
        'algorithm trainer'
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      author: organization,
      publisher: organization,
      image: 'https://nexustimer.com/opengraph-image.png',
      screenshot: [
        {
          '@type': 'ImageObject',
          url: 'https://nexustimer.com/app-desktop-view.webp',
          caption: 'NexusTimer desktop view'
        }
      ],
      featureList: [
        "Rubik's Cube Timer with precision timing",
        'Detailed speedcubing statistics and analytics',
        'Algorithm trainer for CFOP, Roux, and more',
        'Real-time multiplayer mode',
        'Cloud sync across devices',
        'Cross-platform PWA support',
        'Offline-first with local storage',
        '3D interactive cube visualization',
        'Support for all WCA puzzle categories',
        'Available in 17 languages'
      ],
      potentialAction: {
        '@type': 'UseAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://nexustimer.com/app',
          inLanguage: locale,
          actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform']
        }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://nexustimer.com/#website',
      name: 'Nexus Timer',
      alternateName: ['NexusTimer', 'NXTimer'],
      url: 'https://nexustimer.com',
      inLanguage: locale,
      publisher: { '@id': 'https://nexustimer.com/#organization' }
    }
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  )
}
