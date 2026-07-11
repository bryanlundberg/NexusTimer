'use client'

import { useTranslations } from 'next-intl'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'

interface TrainerCurrentCaseInfoProps {
  algCase: AlgorithmCollection
  vizConfig: React.ComponentProps<typeof AlgorithmRender>['config'] | null
  count: number
  reachedEnd?: boolean
}

export default function TrainerCurrentCaseInfo({ algCase, vizConfig, count, reachedEnd }: TrainerCurrentCaseInfoProps) {
  const t = useTranslations('Index.TrainerHistoryPage')

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 border-l-2 border-cube-blue/70">
      <div className="size-14 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center shrink-0">
        {vizConfig ? <AlgorithmRender config={vizConfig} width={56} height={56} /> : null}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{algCase.group}</span>
        <span className="text-sm font-semibold truncate">{algCase.name}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {count} {reachedEnd ? t('total') : t('loaded')}
        </span>
      </div>
    </div>
  )
}
