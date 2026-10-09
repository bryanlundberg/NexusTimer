'use client'

import { ChevronRight } from 'lucide-react'
import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import { pickShowcaseBadges } from '@/entities/achievement/model/showcase-badges'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs } from '@/widgets/people/model/types'
import { useTranslations } from 'next-intl'

interface Props {
  badges: UserBadgesResult
}

const MAX_VISIBLE = 12

export function ProfileBadgesStrip({ badges }: Props) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { set } = usePeopleTab()
  const showcase = pickShowcaseBadges(badges.unlockedFamilies, MAX_VISIBLE)

  if (showcase.length === 0) return null

  return (
    <div className="@container flex w-full items-center gap-3 border-b border-border/40 px-4 py-3 md:px-6">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 @max-lg:[&>:nth-child(n+6)]:hidden @max-3xl:[&>:nth-child(n+9)]:hidden">
        {showcase.map((family) => (
          <button
            key={family.id}
            type="button"
            onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
            className="-mx-1 shrink-0 origin-center scale-75 cursor-pointer"
          >
            <AchievementItem achievement={family} level={family.level} maxLevel={family.maxLevel} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
        className="inline-flex shrink-0 items-center gap-0.5 py-2 text-xs font-medium text-primary hover:underline pointer-coarse:text-[13px]"
      >
        {t('view-all')}
        <ChevronRight aria-hidden className="size-3.5" />
      </button>
    </div>
  )
}
