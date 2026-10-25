'use client'

import { useState } from 'react'
import { useFormatter, useNow, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { PageAsideTile } from '@/shared/ui/page-aside/PageAsideTile'
import { MonthMean } from '@/widgets/page-aside/lib/asideStats'

interface ProgressSectionProps {
  months: MonthMean[]
  lastRecordAt: number | null
}

export default function ProgressSection({ months, lastRecordAt }: ProgressSectionProps) {
  const t = useTranslations('Index.PageAside')
  const format = useFormatter()
  const now = useNow({ updateInterval: 60_000 })
  const [hovered, setHovered] = useState<number | null>(null)

  const current = months[months.length - 1]
  const previous = months[months.length - 2]
  const delta = current?.mean != null && previous?.mean != null ? current.mean - previous.mean : null

  const means = months.flatMap((month) => (month.mean === null ? [] : [month.mean]))
  const slowest = means.length > 0 ? Math.max(...means) : 0
  const fastest = means.length > 0 ? Math.min(...means) : 0
  const focus = months[hovered ?? months.length - 1]
  const monthName = (start: number, style: 'short' | 'long') => format.dateTime(new Date(start), { month: style })

  return (
    <PageAsideSection title={t('progress')}>
      <div className="grid grid-cols-2 gap-1.5">
        <PageAsideTile
          label={t('this-month')}
          value={current?.mean != null ? formatTime(current.mean) : '--'}
          footer={
            delta !== null && delta !== 0 ? (
              <span className={cn('font-mono text-[10px] tabular-nums', delta < 0 ? 'text-faster' : 'text-slower')}>
                {delta < 0 ? '▼ ' : '▲ '}
                {formatTime(Math.abs(delta))}
              </span>
            ) : undefined
          }
        />
        <PageAsideTile label={t('last-month')} value={previous?.mean != null ? formatTime(previous.mean) : '--'} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between gap-2 text-xs">
          <span className="text-muted-foreground">{t('monthly')}</span>
          {focus && (
            <span className="truncate text-foreground">
              <span className="capitalize">{monthName(focus.start, 'long')}</span>
              <span className="font-mono tabular-nums">
                {' · '}
                {focus.mean !== null ? formatTime(focus.mean) : '--'}
              </span>
            </span>
          )}
        </div>
        <div className="flex h-16 items-end gap-1.5" onMouseLeave={() => setHovered(null)}>
          {months.map((month, index) => {
            const isCurrent = index === months.length - 1
            const isFastest = month.mean !== null && month.mean === fastest && means.length > 1
            const height = month.mean === null ? 4 : slowest === 0 ? 100 : Math.max(12, (month.mean / slowest) * 100)
            return (
              <button
                key={month.start}
                type="button"
                aria-label={`${monthName(month.start, 'long')}: ${month.mean !== null ? formatTime(month.mean) : '--'}`}
                onMouseEnter={() => setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                className="flex h-full min-w-0 flex-1 cursor-default items-end outline-none"
              >
                <span
                  className={cn(
                    'w-full transition-[height,background-color] duration-300',
                    month.mean === null
                      ? 'bg-muted'
                      : isFastest
                        ? 'bg-record'
                        : isCurrent
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30',
                    hovered === index && 'brightness-125'
                  )}
                  style={{ height: `${height}%` }}
                />
              </button>
            )
          })}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {months.map((month, index) => (
            <span
              key={month.start}
              className={cn(
                'min-w-0 flex-1 truncate text-center text-[10px] capitalize',
                hovered === index ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {monthName(month.start, 'short')}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {t('last-record')}:{' '}
        <span className="text-foreground">{lastRecordAt ? format.relativeTime(lastRecordAt, now) : t('never')}</span>
      </p>
    </PageAsideSection>
  )
}
