'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { groupBy } from 'es-toolkit'
import { Badge } from '@/components/ui/badge'
import { PuzzleID, TwistyPlayer } from '@rednaxela101/cubing/twisty'
import AlgorithmCard from '@/features/algorithms-list/ui/algorithm-card'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { Filter } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[]
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
  methodSlug?: string
}

export const AlgorithmsList = ({ algorithms, virtualization, puzzle, methodSlug }: AlgorithmsPageProps) => {
  const t = useTranslations('Index')
  const groups = useMemo(() => groupBy(algorithms, (algorithm) => algorithm.group), [algorithms])
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
            <Filter className="h-3.5 w-3.5 text-cube-green" />
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('AlgorithmsPage.filters.group')}
            </span>
            <span aria-hidden className="h-px min-w-4 flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {groupKeys.map((group) => (
              <Badge
                key={group}
                variant={activeGroups.includes(group) ? 'default' : 'outline'}
                onClick={() => handleChooseGroup(group)}
                className="badge-notch cursor-pointer transition-colors select-none text-[10px] sm:text-xs px-2 py-0.5 whitespace-normal break-all max-w-full"
              >
                <span className="min-w-0 break-all">{group}</span>
                <span className="ml-1 opacity-60 shrink-0">{groups[group].length}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-xs text-muted-foreground tabular-nums">
          {t('TrainerPage.algsSuffix', { count: displayedAlgs.length })}
          {activeGroups.length > 0 && (
            <button onClick={() => setActiveGroups([])} className="ml-2 text-primary hover:underline">
              {t('AlgorithmsPage.filters.clear')}
            </button>
          )}
        </p>
        {isAuthed && methodSlug && algorithms.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
            <span>
              {t('TrainerPage.learned')} <span className="font-semibold text-foreground">{learnedIds.length}</span> /{' '}
              {algorithms.length}
            </span>
            <div className="h-1 w-24 overflow-hidden bg-muted sm:w-32" aria-hidden>
              <div
                className="h-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, (learnedIds.length / algorithms.length) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Algorithm rows */}
      <div className="algo-panel-notch divide-y divide-border/60 overflow-hidden">
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
