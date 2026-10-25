import { useLocale } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CHART_COLORS, ChartPoint } from '@/features/line-chart-statistics/model/useLineGraphStatistics'

interface LineGraphReadoutProps {
  point: ChartPoint | null
  isHovering: boolean
}

export default function LineGraphReadout({ point, isHovering }: LineGraphReadoutProps) {
  const locale = useLocale()
  const cubes = useTimerStore((state) => state.cubes)

  if (!point) return <div className="h-14" />

  const { solve } = point
  const cubeName = cubes?.find((cube) => cube.id === solve.cubeId)?.name
  const metrics = [
    { label: 'Ao5', color: CHART_COLORS.ao5, value: point.ao5 },
    { label: 'Ao12', color: CHART_COLORS.ao12, value: point.ao12 },
    { label: 'PB', color: CHART_COLORS.pb, value: point.pb }
  ]

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
        <span
          aria-hidden
          className={cn('size-1.5 shrink-0 transition-colors', isHovering ? 'bg-muted-foreground' : 'bg-primary')}
        />
        <span className="font-mono tabular-nums">#{point.index}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{dayjs(solve.endTime).locale(locale).format('lll')}</span>
        {cubeName && (
          <>
            <span aria-hidden>·</span>
            <span className="truncate">{cubeName}</span>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              'font-mono text-2xl font-semibold leading-none tabular-nums',
              solve.dnf ? 'text-destructive' : point.pb === solve.time ? 'text-record' : 'text-foreground'
            )}
          >
            {solve.dnf ? 'DNF' : formatTime(solve.time)}
          </span>
          {solve.plus2 && !solve.dnf && (
            <span className="bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">+2</span>
          )}
        </span>
        {metrics.map((metric) => (
          <span key={metric.label} className="flex items-baseline gap-1.5 text-xs">
            <span aria-hidden className="size-1.5 shrink-0 self-center" style={{ background: metric.color }} />
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {metric.value === null ? '--' : formatTime(metric.value)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
