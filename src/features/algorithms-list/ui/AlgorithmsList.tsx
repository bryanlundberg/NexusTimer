'use client'

import { useMemo, useState } from 'react'
import _ from 'lodash'
import { Badge } from '@/components/ui/badge'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import AlgorithmCard from '@/features/algorithms-list/ui/algorithm-card'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { Filter } from 'lucide-react'

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[]
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
}

export const AlgorithmsList = ({ algorithms, virtualization, puzzle }: AlgorithmsPageProps) => {
  const groups = useMemo(() => _.groupBy(algorithms, 'group'), [algorithms])
  const [activeGroups, setActiveGroups] = useState<string[]>([])

  const handleChooseGroup = (group: string) => {
    if (activeGroups.includes(group)) {
      setActiveGroups([])
    } else {
      setActiveGroups([group])
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
          <div className="flex flex-wrap gap-2">
            {groupKeys.map((group) => (
              <Badge
                key={group}
                variant={activeGroups.includes(group) ? 'default' : 'outline'}
                onClick={() => handleChooseGroup(group)}
                className="cursor-pointer transition-all hover:shadow-sm select-none"
              >
                {group}
                <span className="ml-1.5 opacity-60">{groups[group].length}</span>
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
        </p>
      </div>

      {/* Algorithm cards grid */}
      <div className="columns-1 sm:columns-2 gap-4">
        {displayedAlgs.map((item) => (
          <AlgorithmCard
            algorithm={item}
            onAlgorithmClick={() => console.log('click')}
            key={`${item.group}-${item.name}`}
            virtualization={virtualization}
            puzzle={puzzle}
          />
        ))}
      </div>
    </>
  )
}
