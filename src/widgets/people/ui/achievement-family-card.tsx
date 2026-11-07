import { useLocale, useTranslations } from 'next-intl'
import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { BadgeFamily } from '@/entities/achievement/model/useUserBadges'
import { cn } from '@/shared/lib/utils'

interface AchievementFamilyCardProps {
  family: BadgeFamily
  rarityPct?: number
}

export function AchievementFamilyCard({ family, rarityPct }: AchievementFamilyCardProps) {
  const t = useTranslations('Index.PeoplePage.badges')
  const locale = useLocale()
  const locked = !family.unlocked
  const { progress } = family
  const rarity = rarityPct === undefined ? null : t('rarity', { pct: formatRarity(rarityPct, locale) })
  const footer = [progress?.label, rarity].filter(Boolean).join(' · ')

  return (
    <div className="surface flex items-start gap-3 p-3">
      <div className="shrink-0">
        <AchievementItem
          achievement={family}
          locked={locked}
          level={family.level}
          maxLevel={family.maxLevel}
          disableTooltip
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className={cn('truncate text-sm font-semibold leading-tight', locked && 'text-muted-foreground')}>
            {family.title}
          </p>
          {family.maxLevel > 1 && (
            <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {family.level}/{family.maxLevel}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{family.description}</p>

        {(progress?.ratio !== undefined || footer) && (
          <div className="mt-0.5 flex flex-col gap-1">
            {progress?.ratio !== undefined && (
              <div className="h-1 w-full overflow-hidden bg-border/60">
                <div
                  className="h-full bg-primary transition-[width] duration-500"
                  style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                />
              </div>
            )}
            {footer && <span className="text-[11px] tabular-nums text-muted-foreground">{footer}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function formatRarity(pct: number, locale: string): string {
  if (pct > 0 && pct < 0.1) return `<${(0.1).toLocaleString(locale)}`
  return pct.toLocaleString(locale, { maximumFractionDigits: pct < 10 ? 1 : 0 })
}
