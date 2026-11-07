'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import { pickShowcaseBadges } from '@/entities/achievement/model/showcase-badges'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs } from '@/widgets/people/model/types'

const MAX_VISIBLE = 12

export function ProfileBadgesPanel({ badges }: { badges: UserBadgesResult }) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { set } = usePeopleTab()
  const showcase = pickShowcaseBadges(badges.unlockedFamilies, MAX_VISIBLE)

  if (showcase.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[10px] leading-none font-semibold tracking-[0.14em] uppercase">
          {t('title')}
        </h2>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {badges.unlockedFamilies.length}/{badges.unlockedFamilies.length + badges.lockedFamilies.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {showcase.map((family) => (
          <button
            key={family.id}
            type="button"
            onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
            className="flex cursor-pointer justify-center"
          >
            <AchievementItem achievement={family} level={family.level} maxLevel={family.maxLevel} />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
        className="inline-flex cursor-pointer items-center gap-0.5 self-start text-xs font-medium text-primary hover:underline"
      >
        {t('view-all')}
        <ChevronRight aria-hidden className="size-3.5" />
      </button>
    </section>
  )
}
