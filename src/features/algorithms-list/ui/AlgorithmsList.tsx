'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import _ from 'lodash'
import { Badge } from '@/components/ui/badge'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import AlgorithmCard from '@/features/algorithms-list/ui/algorithm-card'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { Filter } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[]
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
  methodSlug?: string
}

export const AlgorithmsList = ({ algorithms, virtualization, puzzle, methodSlug }: AlgorithmsPageProps) => {
  const groups = useMemo(() => _.groupBy(algorithms, 'group'), [algorithms])
  const [activeGroups, setActiveGroups] = useState<string[]>([])

  const router = useRouter()
  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id
  const { learnedIds, mutate: mutateLearned } = useTrainerLearned(methodSlug, isAuthed)
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds])

  const handleChooseGroup = (group: string) => {
    if (activeGroups.includes(group)) {
      setActiveGroups([])
    } else {
      setActiveGroups([group])
    }
  }

  const handleToggleLearned = async (caseId: string) => {
    if (!methodSlug) return
    if (!isAuthed) {
      router.push('/sign-in')
      return
    }
    const wasLearned = learnedSet.has(caseId)
    const nextLearned = !wasLearned
    const optimistic = new Set(learnedIds)
    if (nextLearned) optimistic.add(caseId)
    else optimistic.delete(caseId)
    mutateLearned({ caseIds: Array.from(optimistic) }, { revalidate: false })
    try {
      await setTrainerLearned({ methodSlug, caseId, learned: nextLearned })
      await mutateLearned()
    } catch (err) {
      console.error('Failed to update learned:', err)
      mutateLearned()
    }
  }

  const displayedAlgs = useMemo(() => {
    if (activeGroups.length === 0) {
      return algorithms || []
    }
    return (algorithms || []).filter((item) => activeGroups.includes(item.group))
  }, [activeGroups, algorithms])

  const groupKeys = Object.keys(groups)

  return (
    <>
      {/* Filter section */}
      {groupKeys.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Filter by group</span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {groupKeys.map((group) => (
              <Badge
                key={group}
                variant={activeGroups.includes(group) ? 'default' : 'outline'}
                onClick={() => handleChooseGroup(group)}
                className="cursor-pointer transition-all hover:shadow-sm select-none text-[10px] sm:text-xs px-2 py-0.5 whitespace-normal break-all max-w-full"
              >
                <span className="min-w-0 break-all">{group}</span>
                <span className="ml-1 opacity-60 shrink-0">{groups[group].length}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {displayedAlgs.length} algorithm{displayedAlgs.length !== 1 ? 's' : ''}
          {activeGroups.length > 0 && (
            <button onClick={() => setActiveGroups([])} className="ml-2 text-primary hover:underline">
              Clear filter
            </button>
          )}
          {isAuthed && methodSlug && learnedIds.length > 0 && (
            <span className="ml-2 text-muted-foreground">· {learnedIds.length} learned</span>
          )}
        </p>
      </div>

      {/* Algorithm rows */}
      <div className="rounded-lg border bg-card/30 divide-y overflow-hidden">
        {displayedAlgs.map((item) => (
          <AlgorithmCard
            algorithm={item}
            key={`${item.group}-${item.name}`}
            virtualization={virtualization}
            puzzle={puzzle}
            isLearned={learnedSet.has(item.id)}
            onToggleLearned={methodSlug ? () => handleToggleLearned(item.id) : undefined}
          />
        ))}
      </div>
    </>
  )
}
