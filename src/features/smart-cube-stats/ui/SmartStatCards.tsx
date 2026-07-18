import { useTranslations } from 'next-intl'
import type { LucideIcon } from 'lucide-react'
import { Gauge, MousePointerClick, PauseCircle, Workflow } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatTps } from '@/shared/lib/formatTps'
import type { SmartCubeStats } from '@/features/smart-cube-stats/lib/computeSmartCubeStats'

interface SmartStatCardsProps {
  stats: SmartCubeStats
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent
}: {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  accent: string
}) {
  return (
    <div className={cn('flex flex-col gap-1 border-l-2 pl-3 py-0.5', accent)}>
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="text-xl font-semibold tabular-nums leading-none">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground tabular-nums">{sub}</span>}
    </div>
  )
}

export default function SmartStatCards({ stats }: SmartStatCardsProps) {
  const t = useTranslations('Index.StatsPage')

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-1 sm:grid-cols-4">
      <StatCard
        icon={Gauge}
        label={t('smart-avg-tps')}
        value={stats.avgTps > 0 ? formatTps(stats.avgTps) : '—'}
        sub={t('smart-per-solve')}
        accent="border-cube-blue/70"
      />
      <StatCard
        icon={MousePointerClick}
        label={t('smart-avg-moves')}
        value={stats.avgMoves > 0 ? stats.avgMoves.toFixed(1) : '—'}
        sub={t('smart-per-solve')}
        accent="border-cube-yellow/70"
      />
      <StatCard
        icon={PauseCircle}
        label={t('smart-avg-pauses')}
        value={stats.avgPauses > 0 ? stats.avgPauses.toFixed(1) : '—'}
        sub={t('smart-per-solve')}
        accent="border-cube-green/70"
      />
      <StatCard
        icon={Workflow}
        label={t('smart-method')}
        value={stats.method && stats.method !== 'unknown' ? stats.method : '—'}
        accent="border-cube-orange/70"
      />
    </div>
  )
}
