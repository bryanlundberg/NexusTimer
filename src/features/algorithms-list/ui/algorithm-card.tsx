import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import _ from 'lodash'
import { Button } from '@/components/ui/button'
import { EyeIcon, CopyIcon, CheckIcon } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import AlgorithmModal from '@/features/algorithms-list/ui/algorithm-modal'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface AlgorithmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onAlgorithmClick?: () => void
  algorithm: AlgorithmCollection
  virtualization?: TwistyPlayer
  puzzle: PuzzleID
}

export default function AlgorithmCard({
  algorithm,
  onAlgorithmClick,
  virtualization,
  puzzle,
  ...rest
}: AlgorithmCardProps) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { open } = useOverlayStore()
  const algs = algorithm?.algs || algorithm?.alg || []
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const defaults = _.merge(
    {
      visualization: 'experimental-2D-LL',
      background: 'none',
      controlPanel: 'none',
      alg: algs[0],
      experimentalStickering: 'OLL',
      experimentalSetupAnchor: 'end'
    },
    virtualization
  )

  const handleOpenAlgorithmPreview = (alg: string) => {
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

  const handleCopy = async (alg: string, index: number) => {
    await navigator.clipboard.writeText(alg)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <Card
      className={cn(
        'p-4 mb-4 h-auto bg-card/50 break-inside-avoid-column hover:shadow-sm transition-shadow',
        rest.className
      )}
      {...rest}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{algorithm.name}</h3>
          <Badge variant="outline" className="text-[10px] font-normal">
            {algorithm.group}
          </Badge>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {algs.length} {algs.length === 1 ? 'alg' : 'algs'}
        </span>
      </div>

      {/* Cube visualization + algorithms */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="shrink-0 rounded-lg bg-muted/50 p-2 flex items-center justify-center">
          <AlgorithmRender config={defaults} width={100} height={100} />
        </div>

        <div className="flex flex-col gap-2 w-full min-w-0">
          {algs.map((alg, index) => (
            <div
              className="group/alg rounded-lg border bg-background/80 p-2.5 transition-colors hover:bg-muted/30"
              onClick={onAlgorithmClick}
              key={`${algorithm.group}-${algorithm.name}-alg-${index}`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {t('alternative')} #{index + 1}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono leading-relaxed break-all">{alg}</code>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover/alg:opacity-100 transition-all [&>svg]:transition-transform [&>svg]:duration-200 [&:active>svg]:scale-125"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(alg, index)
                    }}
                  >
                    {copiedIndex === index ? (
                      <CheckIcon className="h-3.5 w-3.5 animate-[scaleIn_0.2s_ease-out]" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-105"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenAlgorithmPreview(alg)
                    }}
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
