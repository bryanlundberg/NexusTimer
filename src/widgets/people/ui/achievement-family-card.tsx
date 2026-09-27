import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { BadgeFamily } from '@/entities/achievement/model/useUserBadges'
import { cn } from '@/shared/lib/utils'

export function AchievementFamilyCard({ family }: { family: BadgeFamily }) {
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
