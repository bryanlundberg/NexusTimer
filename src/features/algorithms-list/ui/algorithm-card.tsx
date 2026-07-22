import { useMemo, useState } from 'react'
import _ from 'lodash'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import { ChevronDown, Play } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import AlgorithmModal from '@/features/algorithms-list/ui/algorithm-modal'
import ActionButton from '@/features/algorithms-list/ui/action-button'
import LearnedToggle from '@/features/algorithms-list/ui/learned-toggle'
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

  const vizConfig = useMemo(
    () =>
      applyYellowOrientation(
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
      ),
    [primary?.moves, virtualization]
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
    <div
      className={cn('transition-colors', isLearned && 'bg-primary/5 shadow-[inset_2px_0_0_var(--primary)]', className)}
    >
      <div
        className={cn(
          'flex items-start gap-2 px-2 py-2 transition-colors sm:gap-3 sm:px-3 sm:py-2.5',
          canExpand && 'cursor-pointer'
        )}
        onClick={() => canExpand && setExpanded((v) => !v)}
        role={canExpand ? 'button' : undefined}
        tabIndex={canExpand ? 0 : undefined}
      >
        <div
          className={cn(
            'badge-notch flex size-16 shrink-0 items-center justify-center bg-muted/40 sm:size-20',
            isLearned && 'ring-1 ring-primary/40'
          )}
        >
          <AlgorithmRender config={vizConfig} width={92} height={92} />
        </div>

        <div className="flex flex-1 min-w-0 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-medium">{algorithm.name}</h3>
            <Badge variant="outline" className="badge-notch shrink-0 text-[10px] font-normal">
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

        <div className="flex shrink-0 items-center gap-1 self-center">
          {onToggleLearned && <LearnedToggle learned={isLearned} onClick={onToggleLearned} />}
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
