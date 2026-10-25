'use client'

import { useFormatter, useNow, useTranslations } from 'next-intl'
import { Cube } from '@/entities/cube/model/types'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import CubeUsageRow from '@/widgets/page-aside/ui/CubeUsageRow'

export interface CubeUsage {
  cube: Cube
  count: number
  lastAt: number | null
}

interface CubesUsageSectionProps {
  recent: CubeUsage[]
}

const SLOTS = 2

export default function CubesUsageSection({ recent }: CubesUsageSectionProps) {
  const t = useTranslations('Index.PageAside')
  const format = useFormatter()
  const now = useNow({ updateInterval: 60_000 })

  return (
    <PageAsideSection title={t('recent')}>
      {Array.from({ length: SLOTS }, (_, index) => {
        const item = recent[index]
        if (!item) {
          return (
            <div key={index} className="-mx-2 flex items-center gap-3 px-2 py-2">
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span aria-hidden className="h-3.5 w-28 bg-muted" />
                <span aria-hidden className="h-2.5 w-16 bg-muted/60" />
              </span>
              <span aria-hidden className="size-8 shrink-0 bg-foreground/[0.04]" />
            </div>
          )
        }
        return (
          <CubeUsageRow
            key={item.cube.id}
            cube={item.cube}
            detail={`${item.lastAt ? format.relativeTime(item.lastAt, now) : t('never')} · ${t('solves-count', { count: item.count })}`}
          />
        )
      })}
    </PageAsideSection>
  )
}
