'use client'

import { notFound, useParams } from 'next/navigation'
import { TwistyPlayer } from 'cubing/twisty'
import { AlgorithmsList } from '@/features/algorithms-list/ui/AlgorithmsList'
import AlgorithmsBreadcrumb from '@/widgets/algorithms-breadcrumb/ui/AlgorithmsBreadcrumb'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import { ScrollArea } from '@/components/ui/scroll-area'
import Information from '@/features/algorithms-list/ui/information'
import { ALGORITHMS_GITHUB_URL } from '@/shared/const/algorithms-github-url'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

export default function AlgorithmsMethodPage() {
  const params = useParams()
  const collection = ALGORITHM_SETS.find((set: { slug: string }) => set.slug === params!.slug)

  if (!collection) {
    notFound()
  }

  return (
    <ScrollArea className="max-h-dvh overflow-auto p-4">
      <AlgorithmsBreadcrumb />
      <Information title={`${collection.title} - Algorithms`} description={collection.description} />
      <AlgorithmsList
        algorithms={collection.algorithms}
        virtualization={collection.virtualization as unknown as TwistyPlayer}
        puzzle={collection.puzzle}
      />

      {collection.file && (
        <Suggestions
          link={ALGORITHMS_GITHUB_URL + `/${collection.file.toLowerCase()}`}
          message={'Edit this algorithms on Github'}
        />
      )}
    </ScrollArea>
  )
}
