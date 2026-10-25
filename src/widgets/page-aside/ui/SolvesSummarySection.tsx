'use client'

import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { PageAsideTile } from '@/shared/ui/page-aside/PageAsideTile'
import { SolvesSummary } from '@/widgets/page-aside/lib/asideStats'

interface SolvesSummarySectionProps {
  title: string
  summary: SolvesSummary
}

export default function SolvesSummarySection({ title, summary }: SolvesSummarySectionProps) {
  const t = useTranslations('Index.PageAside')
  const time = (value: number | null) => (value === null ? '--' : formatTime(value))
  const clean = Math.max(0, summary.count - summary.dnf - summary.plus2)
  const share = (count: number) => (summary.count > 0 ? `${(count / summary.count) * 100}%` : '0%')

  return (
    <PageAsideSection title={title}>
      <div className="grid grid-cols-3 gap-1.5">
        <PageAsideTile label={t('solves')} value={summary.count} />
        <PageAsideTile label={t('mean')} value={time(summary.mean)} />
        <PageAsideTile
          label={t('best')}
          value={time(summary.best)}
          tone={summary.best === null ? 'default' : 'record'}
        />
        <PageAsideTile label={t('worst')} value={time(summary.worst)} />
        <PageAsideTile label="+2" value={summary.plus2} />
        <PageAsideTile label="DNF" value={summary.dnf} tone={summary.dnf > 0 ? 'danger' : 'default'} />
      </div>

      {summary.count > 0 && (
        <div className="mt-3">
          <div className="flex h-1.5 w-full gap-px overflow-hidden bg-muted">
            <span className="bg-muted-foreground/40 transition-[width] duration-300" style={{ width: share(clean) }} />
            <span className="bg-warning transition-[width] duration-300" style={{ width: share(summary.plus2) }} />
            <span className="bg-destructive transition-[width] duration-300" style={{ width: share(summary.dnf) }} />
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span aria-hidden className="size-1.5 bg-muted-foreground/40" />
              {t('clean')} {Math.round((clean / summary.count) * 100)}%
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden className="size-1.5 bg-warning" />
              +2
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden className="size-1.5 bg-destructive" />
              DNF
            </span>
          </div>
        </div>
      )}
    </PageAsideSection>
  )
}
