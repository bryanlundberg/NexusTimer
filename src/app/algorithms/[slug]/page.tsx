import type { Metadata } from 'next'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { notFound } from 'next/navigation'
import { TwistyPlayer } from 'cubing/twisty'
import { AlgorithmsList } from '@/features/algorithms-list/ui/AlgorithmsList'
import AlgorithmsBreadcrumb from '@/widgets/algorithms-breadcrumb/ui/AlgorithmsBreadcrumb'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import { ScrollArea } from '@/components/ui/scroll-area'
import Information from '@/features/algorithms-list/ui/information'
import { ALGORITHMS_GITHUB_URL } from '@/shared/const/algorithms-github-url'
import { getLocale, getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Index.AlgorithmsPage' })

  const collection = ALGORITHM_SETS.find((set) => set.slug === slug)
  if (collection) {
    return {
      title: collection.title + ' - ' + t('title'),
      description: t(`descriptions.${collection.slug}`),
      openGraph: {
        title: collection.title + ' - ' + t('title'),
        description: t(`descriptions.${collection.slug}`),
        siteName: 'Nexus Timer',
        locale: locale,
        type: 'website'
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

  return (
    <ScrollArea className="max-h-dvh overflow-auto p-4">
      <AlgorithmsBreadcrumb />
      <Information title={`${collection.title} - ${t('title')}`} description={t(`descriptions.${collection.slug}`)} />
      <AlgorithmsList
        algorithms={collection.algorithms}
        virtualization={collection.virtualization as unknown as TwistyPlayer}
        puzzle={collection.puzzle}
      />

      {collection.file && (
        <Suggestions link={ALGORITHMS_GITHUB_URL + `/${collection.file.toLowerCase()}`} message={t('edit-github')} />
      )}
    </ScrollArea>
  )
}
