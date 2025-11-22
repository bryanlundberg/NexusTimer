import type { Metadata, ResolvingMetadata } from 'next'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug

  const collection = ALGORITHM_SETS.find((set) => set.slug === slug)
  if (collection) {
    return {
      title: collection.title + ' - Algorithms',
      description: collection.description,
      openGraph: {
        title: collection.title + ' - Algorithms',
        description: collection.description,
        siteName: 'Nexus Timer',
        locale: 'en_US',
        type: 'website'
      }
    }
  }

  return {
    title: 'Algorithms',
    description:
      'Explore a wide range of algorithm sets for various puzzles, complete with interactive 3D visualizations to enhance your learning experience.'
  }
}

export async function generateStaticParams() {
  return ALGORITHM_SETS.map((set) => {
    return { slug: set.slug }
  })
}

export { default } from '@/pages/algorithms-method/ui/AlgorithmsMethodPage'
