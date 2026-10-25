'use client'

import { useFormatter, useNow, useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'
import { Solve } from '@/entities/solve/model/types'
import Segmented from '@/shared/ui/segmented/Segmented'
import { PageAsideSection } from '@/shared/ui/page-aside/PageAsideSection'
import { AsideRecord, RECORD_SIZES } from '@/widgets/page-aside/lib/asideStats'
import RecordRow from '@/widgets/page-aside/ui/RecordRow'

export type RecordScope = 'cube' | 'category'

interface RecordsSectionProps {
  records: AsideRecord[]
  scope: RecordScope
  onScopeChange: (scope: RecordScope) => void
}

export default function RecordsSection({ records, scope, onScopeChange }: RecordsSectionProps) {
  const t = useTranslations('Index.PageAside')
  const format = useFormatter()
  const now = useNow({ updateInterval: 60_000 })
  const open = useOverlayStore((state) => state.open)

  const openSolve = (solve: Solve) => {
    open({ id: 'solve-details', metadata: { ...solve }, component: <SolveDetails /> })
  }

  return (
    <PageAsideSection title={t('records')}>
      <Segmented
        value={scope}
        onChange={onScopeChange}
        options={[
          { value: 'cube', label: t('scope-cube') },
          { value: 'category', label: t('scope-category') }
        ]}
        layoutId="page-aside-record-scope"
        className="mb-3 w-full [&>button]:flex-1 [&>button]:justify-center [&>button]:text-xs"
      />
      <div className="-mx-2 flex flex-col">
        {RECORD_SIZES.map((size) => {
          const label = size === 1 ? t('single') : `Ao${size}`
          const record = records.find((item) => item.size === size)
          if (record) {
            return (
              <RecordRow
                key={size}
                record={record}
                label={label}
                when={format.relativeTime(record.at, now)}
                onOpenSolve={openSolve}
              />
            )
          }
          return (
            <div key={size} className="flex items-center gap-3 px-2 py-2">
              <span className="w-12 shrink-0 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
                {label}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground/60">
                {t('needs-solves', { count: size })}
              </span>
              <span className="font-mono text-sm tabular-nums text-muted-foreground/60">--</span>
              <span aria-hidden className="size-3.5 shrink-0" />
            </div>
          )
        })}
      </div>
    </PageAsideSection>
  )
}
