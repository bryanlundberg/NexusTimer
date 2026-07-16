'use client'

import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs } from '@/widgets/people/model/types'
import { useTranslations } from 'next-intl'

interface Props {
  badges: UserBadgesResult
}

const MAX_VISIBLE = 10

export function ProfileBadgesStrip({ badges }: Props) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { set } = usePeopleTab()
  const { unlocked, total } = badges

  if (unlocked.length === 0) return null

  const visible = unlocked.slice(0, MAX_VISIBLE)
  const overflow = unlocked.length - visible.length

  return (
    <div className="w-full px-4 md:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 border-b border-border/40">
      <button
        type="button"
        onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
        className="ml-auto text-xs font-medium text-primary hover:underline sm:hidden"
      >
        {t('view-all')}
      </button>

      <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide sm:overflow-hidden">
        {visible.map((badge) => (
          <div key={badge.id} className="scale-75 origin-center -mx-1 shrink-0">
            <AchievementItem achievement={badge} />
          </div>
        ))}
        {overflow > 0 && <span className="text-xs font-semibold text-muted-foreground shrink-0">+{overflow}</span>}
      </div>

      <button
        type="button"
        onClick={() => set(PeopleTabs.ACHIEVEMENTS)}
        className="hidden sm:inline-flex sm:ml-auto text-xs font-medium text-primary hover:underline shrink-0"
      >
        {t('view-all')}
      </button>
    </div>
  )
}
