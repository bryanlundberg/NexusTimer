import { useState } from 'react'
import _ from 'lodash'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import { Bookmark, BookmarkCheck, ChevronDown, Play } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import AlgorithmModal from '@/features/algorithms-list/ui/algorithm-modal'
import ActionButton from '@/features/algorithms-list/ui/action-button'
import AlternativeRow from '@/features/algorithms-list/ui/alternative-row'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'

interface AlgorithmCardProps {
  algorithm: AlgorithmCollection
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
  isLearned?: boolean
  onToggleLearned?: () => void
  className?: string
}

export default function AlgorithmCard({
  algorithm,
  virtualization,
  puzzle,
  isLearned,
  onToggleLearned,
  className
}: AlgorithmCardProps) {
  const { open } = useOverlayStore()
  const [expanded, setExpanded] = useState(false)

  const [primary, ...alternatives] = algorithm.algs
  const canExpand = alternatives.length > 0

  const vizConfig = applyYellowOrientation(
    _.merge(
      {
        visualization: 'experimental-2D-LL',
        background: 'none',
        controlPanel: 'none',
        alg: primary?.moves,
        experimentalStickering: 'OLL',
        experimentalSetupAnchor: 'end'
      },
      virtualization
    )
  )

  const openPreview = (alg: string) => {
    open({
      id: 'algorithm-preview',
      component: <AlgorithmModal />,
      metadata: {
        name: `${algorithm.group}-${algorithm.name}`,
        cube: puzzle,
        alg
      }
    })
  }

  return (
    <div className={cn('transition-colors', isLearned && 'bg-primary/5', expanded && 'bg-muted/30', className)}>
      <div
        className={cn(
          'flex items-start gap-2 px-2 py-2 transition-colors hover:bg-muted/40 sm:gap-3 sm:px-3 sm:py-2.5',
          canExpand && 'cursor-pointer'
        )}
        onClick={() => canExpand && setExpanded((v) => !v)}
        role={canExpand ? 'button' : undefined}
        tabIndex={canExpand ? 0 : undefined}
      >
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-md bg-muted/40 sm:size-16',
            isLearned && 'ring-1 ring-primary/40'
          )}
        >
          <AlgorithmRender config={vizConfig} width={72} height={72} />
        </div>

        <div className="flex flex-1 min-w-0 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-medium">{algorithm.name}</h3>
            <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
              {algorithm.group}
            </Badge>
            {canExpand && (
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">+{alternatives.length}</span>
            )}
          </div>
          <code className="block min-w-0 break-all font-mono leading-relaxed text-muted-foreground">
            {primary?.moves ?? '—'}
          </code>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 self-center">
          {onToggleLearned && (
            <ActionButton
              icon={isLearned ? BookmarkCheck : Bookmark}
              label={isLearned ? 'Marked as learned' : 'Mark as learned'}
              active={isLearned}
              onClick={onToggleLearned}
            />
          )}
          <ActionButton icon={Play} label="Play" onClick={() => primary && openPreview(primary.moves)} />
          {canExpand && (
            <ChevronDown
              className={cn(
                'ml-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform',
                expanded && 'rotate-180'
              )}
            />
          )}
        </div>
      </div>

      {expanded && canExpand && (
        <div className="space-y-1.5 px-2 pb-2.5 sm:px-3 sm:pl-17">
          {alternatives.map((alt, i) => (
            <AlternativeRow key={alt.id} alt={alt} index={i + 1} onPreview={() => openPreview(alt.moves)} />
          ))}
        </div>
      )}
    </div>
  )
}
