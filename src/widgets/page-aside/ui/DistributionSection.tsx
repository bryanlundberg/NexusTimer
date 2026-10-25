'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { buildDistribution } from '@/widgets/page-aside/lib/asideStats'

interface DistributionSectionProps {
  solves: Solve[]
}

export default function DistributionSection({ solves }: DistributionSectionProps) {
  const t = useTranslations('Index.PageAside')
  const distribution = useMemo(() => buildDistribution(solves), [solves])
  const [hovered, setHovered] = useState<number | null>(null)
  const peak = distribution ? Math.max(...distribution.bins) : 0

  const readout = useMemo(() => {
    if (!distribution) return null
    const index = hovered ?? distribution.meanBin
    const width = (distribution.max - distribution.min) / distribution.bins.length
    const from = distribution.min + width * index
    return {
      range: width === 0 ? formatTime(distribution.min) : `${formatTime(from)} - ${formatTime(from + width)}`,
      count: distribution.bins[index]
    }
  }, [distribution, hovered])

  return (
    <PageAsideSection title={t('distribution')}>
      {!distribution || !readout ? (
        <p className="text-xs text-muted-foreground">{t('distribution-empty')}</p>
      ) : (
        <>
          <div className="mb-2 flex items-baseline justify-between gap-2 text-xs">
            <span className="font-mono tabular-nums text-foreground">{readout.range}</span>
            <span className="text-muted-foreground">{t('solves-count', { count: readout.count })}</span>
          </div>
          <div className="flex h-16 items-end gap-[2px]" onMouseLeave={() => setHovered(null)}>
            {distribution.bins.map((count, index) => (
              <span key={index} onMouseEnter={() => setHovered(index)} className="flex h-full min-w-0 flex-1 items-end">
                <span
                  className={cn(
                    'w-full transition-colors',
                    hovered === index
                      ? 'bg-foreground'
                      : index === distribution.meanBin
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30'
                  )}
                  style={{ height: count === 0 ? 2 : `${Math.max(6, (count / peak) * 100)}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
            <span>{formatTime(distribution.min)}</span>
            <span className="flex items-center gap-1 font-sans">
              <span aria-hidden className="size-1.5 bg-primary" />
              {t('mean')}
            </span>
            <span>{formatTime(distribution.max)}</span>
          </div>
        </>
      )}
    </PageAsideSection>
  )
}
