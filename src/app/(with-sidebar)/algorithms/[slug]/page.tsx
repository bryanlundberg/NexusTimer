import type { Metadata } from 'next'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { notFound } from 'next/navigation'
import { TwistyPlayer } from 'cubing/twisty'
import { AlgorithmsList } from '@/features/algorithms-list/ui/AlgorithmsList'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import SuggestAlgorithmButton from '@/features/suggest-algorithm/ui/SuggestAlgorithmButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import Information from '@/features/algorithms-list/ui/information'
import TrainerCTA from '@/features/algorithms-list/ui/trainer-cta'
import { ALGORITHMS_GITHUB_URL } from '@/shared/const/algorithms-github-url'
import { getLocale, getTranslations } from 'next-intl/server'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { locales } from '@/shared/config/i18n/locales'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Index.AlgorithmsPage' })

  const collection = ALGORITHM_SETS.find((set) => set.slug === slug)
  if (collection) {
    const title = collection.title + ' - ' + t('title')
    const description = t(`descriptions.${collection.slug}`)
    return {
      title,
      description,
      keywords: [
        collection.title,
        "rubik's cube algorithms",
        'speedcubing algorithms',
        'cube algorithms',
        'nexus timer',
        'algorithm trainer'
      ],
      alternates: {
        canonical: `/algorithms/${slug}`,
        languages: Object.fromEntries(locales.map((l) => [l, `/algorithms/${slug}`]))
      },
      openGraph: {
        title,
        description,
        siteName: 'Nexus Timer',
        locale: locale,
        type: 'website',
        images: [
          {
            url: '/algorithms/opengraph-image.png',
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/algorithms/opengraph-image.png']
      }
    }
  }

  return {
    title: t('title'),
    description: t('description')
  }
}

export async function generateStaticParams() {
  return ALGORITHM_SETS.map((set) => {
    return { slug: set.slug }
  })
}

export default async function AlgorithmsMethodPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Index.AlgorithmsPage' })

  const collection = ALGORITHM_SETS.find((set: { slug: string }) => set.slug === slug)

  if (!collection) {
    notFound()
  }

  const pageTitle = `${collection.title} - ${t('title')}`
  const pageDescription = t(`descriptions.${collection.slug}`)
  const pageUrl = `https://nexustimer.com/algorithms/${slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://nexustimer.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('title'),
        item: 'https://nexustimer.com/algorithms'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: collection.title,
        item: pageUrl
      }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${collection.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pageDescription
        }
      },
      {
        '@type': 'Question',
        name: `How many ${collection.title} algorithms are there?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${collection.title} set contains ${collection.algorithms.length} algorithms for the ${collection.puzzle} puzzle.`
        }
      },
      {
        '@type': 'Question',
        name: `How can I learn ${collection.title} algorithms?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can learn ${collection.title} algorithms using Nexus Timer's interactive algorithm trainer. Each algorithm is displayed with a 3D visualization and move notation to help you memorize and practice them efficiently.`
        }
      }
    ]
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { '@id': 'https://nexustimer.com/#website' },
    breadcrumb: { '@id': `${pageUrl}/#breadcrumb` }
  }

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <CoreHeader
        breadcrumbs={[
          { label: t('title'), href: '/algorithms' },
          { label: slug.toUpperCase(), href: `/algorithms/${slug}` }
        ]}
      />

      <PageBody
        variant="hero"
        className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12 max-w-4xl mx-auto"
      >
        <Information
          title={`${collection.title} - ${t('title')}`}
          description={t(`descriptions.${collection.slug}`)}
          algorithmCount={collection.algorithms.length}
          actions={<TrainerCTA methodSlug={collection.slug} />}
        />
        <AlgorithmsList
          algorithms={collection.algorithms}
          virtualization={collection.virtualization as unknown as TwistyPlayer}
          puzzle={collection.puzzle}
          methodSlug={collection.slug}
        />

        <div className="mt-6 flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-6">
          <SuggestAlgorithmButton
            methods={[
              {
                slug: collection.slug,
                title: collection.title,
                puzzle: collection.puzzle,
                caseNames: collection.algorithms.map((a) => a.name)
              }
            ]}
            initialSlug={collection.slug}
          />
          {collection.file && (
            <Suggestions
              link={ALGORITHMS_GITHUB_URL + `/${collection.file.toLowerCase()}`}
              message={t('edit-github')}
            />
          )}
        </div>
      </PageBody>
    </ScrollArea>
  )
}
