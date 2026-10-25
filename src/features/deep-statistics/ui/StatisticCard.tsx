import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { StatisticScope } from '@/shared/types/statistics'
import { StatisticCardDef } from '@/features/deep-statistics/model/statisticCards'

interface StatisticCardProps {
  card: StatisticCardDef
  mainScope: StatisticScope
  sessionScope: StatisticScope
  isLoading: boolean
}

export default function StatisticCard({ card, mainScope, sessionScope, isLoading }: StatisticCardProps) {
  const t = useTranslations('Index')
  const Icon = card.icon
  const main = card.raw(mainScope)
  const session = card.raw(sessionScope)
  const mainLabel = isLoading ? '--' : card.format(mainScope)
  const sessionLabel = isLoading ? '--' : card.format(sessionScope)
  const isEmpty = mainLabel === '--'

  const delta =
    !isLoading && main !== null && session !== null && session !== main
      ? card.comparison === 'lower-better'
        ? { improved: session < main, text: formatTime(Math.abs(session - main)) }
        : card.comparison === 'higher-better'
          ? { improved: session > main, text: `${Math.abs(session - main).toFixed(1)}%` }
          : null
      : null

  return (
    <div
      className={cn(
        'group relative flex min-w-0 flex-col gap-1 bg-foreground/[0.04] px-3 py-2.5 transition-colors hover:bg-foreground/[0.07]'
      )}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <Icon
          aria-hidden
          className={cn(
            'size-3 shrink-0',
            card.highlight ? 'text-record' : 'text-muted-foreground/60 group-hover:text-primary'
          )}
        />
        <span className="truncate font-display text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {card.label}
        </span>
      </span>

      <span
        className={cn(
          'truncate font-mono text-lg font-semibold leading-tight tabular-nums',
          isEmpty ? 'text-muted-foreground/40' : card.highlight ? 'text-record' : 'text-foreground'
        )}
      >
        {mainLabel}
      </span>

      <span className="flex min-w-0 items-baseline gap-1.5 text-[11px]">
        <span className="shrink-0 text-muted-foreground">{t('SolvesRail.session')}</span>
        <span
          className={cn(
            'truncate font-mono tabular-nums',
            sessionLabel === '--' ? 'text-muted-foreground/40' : 'text-foreground/80'
          )}
        >
          {sessionLabel}
        </span>
        {delta && (
          <span
            className={cn(
              'ml-auto shrink-0 font-mono text-[10px] tabular-nums',
              delta.improved ? 'text-faster' : 'text-slower'
            )}
          >
            {(card.comparison === 'lower-better') === delta.improved ? '▼' : '▲'} {delta.text}
          </span>
        )}
      </span>
    </div>
  )
}
