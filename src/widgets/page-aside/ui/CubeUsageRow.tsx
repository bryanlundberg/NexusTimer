'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Cube } from '@/entities/cube/model/types'
import PlayerIcon from '@/components/ui/player-icon'
import type { AnimatedIconHandle } from '@/components/ui/types'
import { CubeColorDot } from '@/shared/ui/category-badge/CubeColorDot'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'

interface CubeUsageRowProps {
  cube: Cube
  detail: string
}

export default function CubeUsageRow({ cube, detail }: CubeUsageRowProps) {
  const t = useTranslations('Index.PageAside')
  const { handleRedirect } = useCubeActions(cube)
  const playRef = useRef<AnimatedIconHandle>(null)

  return (
    <button
      type="button"
      onClick={handleRedirect}
      onMouseEnter={() => playRef.current?.startAnimation()}
      onMouseLeave={() => playRef.current?.stopAnimation()}
      aria-label={`${t('use-cube')} ${cube.name}`}
      className="group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-accent/50"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <CubeColorDot category={cube.category} />
          <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary">{cube.name}</span>
        </span>
        <span className="truncate text-xs text-muted-foreground">{detail}</span>
      </span>
      <span className="flex size-8 shrink-0 items-center justify-center bg-foreground/[0.04] text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <PlayerIcon ref={playRef} size={14} />
      </span>
    </button>
  )
}
