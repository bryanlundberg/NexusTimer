'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { SharedSolveItem } from '@/entities/shared-solve/model/types'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs } from '@/widgets/people/model/types'
import { ProfileSharedRow } from '@/widgets/people/ui/profile-shared-row'

const MAX_VISIBLE = 5

export function ProfileSharedPanel({ items, total }: { items: SharedSolveItem[]; total: number }) {
  const t = useTranslations('Index.PeoplePage')
  const { set } = usePeopleTab()

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[10px] leading-none font-semibold tracking-[0.14em] uppercase">
          {t('tabs.shared')}
        </h2>
        <span className="text-[11px] tabular-nums text-muted-foreground">{total}</span>
      </div>
      <div className="flex flex-col">
        {items.slice(0, MAX_VISIBLE).map((item) => (
          <ProfileSharedRow key={item.slug} item={item} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => set(PeopleTabs.SHARED)}
        className="inline-flex cursor-pointer items-center gap-0.5 self-start text-xs font-medium text-primary hover:underline"
      >
        {t('badges.view-all')}
        <ChevronRight aria-hidden className="size-3.5" />
      </button>
    </section>
  )
}
