import { TwistyPlayer } from 'cubing/twisty';
import { notFound } from 'next/navigation';
import { AlgorithmsPage } from '@/components/algorithms/algorithms-page/algorithms-page';
import { ALGORITHM_SETS } from '@/constants/algorithms-sets';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug

  const collection = ALGORITHM_SETS.find((set) => set.slug === slug)
  if (collection) {
    return {
      title: collection.title + ' - Algorithms',
      description: collection.description,
    }
  }

  return {
    title: 'Algorithms',
    description: 'Explore a wide range of algorithm sets for various puzzles, complete with interactive 3D visualizations to enhance your learning experience.',
  }
}

export async function generateStaticParams() {
  return ALGORITHM_SETS.map((set) => {
    return { slug: set.slug };
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const collection = ALGORITHM_SETS.find((set: { slug: string; }) => set.slug === slug);

  if (!collection) {
    notFound();
  }

  return (
    <AlgorithmsPage
      algorithms={collection.algorithms}
      title={`${collection.title} - Algorithms`}
      description={collection.description}
      virtualization={collection.virtualization as unknown as TwistyPlayer}
      fileCollectionName={collection.file}
      puzzle={collection.puzzle}
    />
  )
}
