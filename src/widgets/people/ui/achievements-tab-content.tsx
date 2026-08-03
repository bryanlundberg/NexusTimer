'use client'

import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { UserBadgesResult, BadgeFamily } from '@/entities/achievement/model/useUserBadges'
import { cn } from '@/shared/lib/utils'
import { useTranslations } from 'next-intl'

interface Props {
  badges: UserBadgesResult
}

function FamilyCard({ family }: { family: BadgeFamily }) {
  const locked = !family.unlocked
  const { progress } = family

  return (
    <div
      className={cn(
        'notch-bl-tr [--nblt:12px] flex items-center gap-3 border border-border/40 bg-card/40 p-3 transition-colors',
        locked ? 'opacity-60' : 'hover:border-primary'
      )}
    >
      <div className="shrink-0">
        <AchievementItem
          achievement={family}
          locked={locked}
          level={family.level}
          maxLevel={family.maxLevel}
          disableTooltip
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight truncate">{family.title}</p>
        <p className="text-xs text-muted-foreground leading-snug">{family.description}</p>

        {progress && (
          <div className="mt-1.5 flex flex-col gap-1">
            {progress.ratio !== undefined && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                />
              </div>
            )}
            <span className="text-[11px] tabular-nums text-muted-foreground">{progress.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AchievementsTabContent({ badges }: Props) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { unlockedFamilies, lockedFamilies, earnedTiers, totalTiers } = badges

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          {t('title')}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {t('counter', { unlocked: earnedTiers, total: totalTiers })}
        </span>
      </div>

      {unlockedFamilies.length === 0 && <p className="text-sm text-muted-foreground">{t('empty')}</p>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {[...unlockedFamilies, ...lockedFamilies].map((family) => (
          <FamilyCard key={family.id} family={family} />
        ))}
      </div>
    </div>
  )
}
