'use client'

import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import { useTranslations } from 'next-intl'

interface Props {
  badges: UserBadgesResult
}

export default function AchievementsTabContent({ badges }: Props) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { unlocked, total } = badges

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          {t('title')}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {t('counter', { unlocked: unlocked.length, total })}
        </span>
      </div>

      {unlocked.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {unlocked.map((badge) => (
            <div
              key={badge.id}
              className="notch-bl-tr [--nblt:12px] flex items-center gap-3 border border-border/40 bg-card/40 p-3 transition-colors hover:border-primary"
            >
              <div className="shrink-0">
                <AchievementItem achievement={badge} disableTooltip />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">{badge.title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
