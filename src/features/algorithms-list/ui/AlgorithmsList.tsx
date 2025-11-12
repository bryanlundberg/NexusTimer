'use client'

import { useMemo, useState } from 'react'
import _ from 'lodash'
import { Badge } from '@/components/ui/badge'
import { AlgorithmCollection } from '@/interfaces/AlgorithmCollection'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import AlgorithmCard from '@/features/algorithms-list/ui/algorithm-card'

interface AlgorithmsPageProps {
  algorithms: AlgorithmCollection[]
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
}

export const AlgorithmsList = ({ algorithms, virtualization, puzzle }: AlgorithmsPageProps) => {
  const groups = useMemo(() => _.groupBy(algorithms, 'group'), [algorithms])
  const [activeGroups, setActiveGroups] = useState<string[]>([])

  const handleChooseGroup = (group: string) => {
    if (activeGroups.includes(group)) return
    setActiveGroups([group])
  }

  const displayedAlgs = useMemo(() => {
    if (activeGroups.length === 0) {
      return algorithms || []
    }
    return (algorithms || []).filter((item) => activeGroups.includes(item.group))
  }, [activeGroups, algorithms])

  return (
    <>
      {Object.keys(groups).map((group) => (
        <Badge
          key={group}
          variant={activeGroups.includes(group) ? 'default' : 'secondary'}
          onClick={() => handleChooseGroup(group)}
          className={'mr-2 mb-2'}
        >
          {group} ({groups[group].length})
        </Badge>
      ))}

      <div className={'mt-5'}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className={'columns-1 gap-3 sm:col-span-2 sm:columns-2 mb-3'}>
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
        </div>
      </div>
    </>
  )
}
