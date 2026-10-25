import useLineGraphStatistics, {
  CHART_COLORS,
  CHART_RANGES,
  ChartRange
} from '@/features/line-chart-statistics/model/useLineGraphStatistics'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import Segmented from '@/shared/ui/segmented/Segmented'
import LineGraphLegend, { LegendEntry } from './LineGraphLegend'
import LineGraphReadout from './LineGraphReadout'

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const t = useTranslations('Index.StatsPage')
  const { chartContainerRef, activePoint, isHovering, count, range, setRange, toggles } = useLineGraphStatistics(solves)

  const ranges: { value: string; label: string }[] = [
    ...CHART_RANGES.filter((size) => size < count).map((size) => ({ value: String(size), label: String(size) })),
    { value: 'all', label: t('chart-all') }
  ]

  const entry = (key: keyof typeof toggles, label: string, color: string, style: LegendEntry['style']): LegendEntry => {
    const [active, setActive] = toggles[key]
    return { key, label, color, style, active, onToggle: () => setActive(!active) }
  }

  const legend = [
    entry('solves', t('chart-solves'), 'var(--primary)', 'solid'),
    entry('ao5', 'Ao5', CHART_COLORS.ao5, 'solid'),
    entry('ao12', 'Ao12', CHART_COLORS.ao12, 'solid'),
    entry('pb', 'PB', CHART_COLORS.pb, 'steps'),
    entry('worst', t('chart-worst'), CHART_COLORS.worst, 'dashed'),
    entry('sd', '±σ', CHART_COLORS.sd, 'dotted')
  ]

  return (
    <div className="surface surface-panel relative flex w-full flex-col gap-3 p-3 md:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <LineGraphReadout point={activePoint} isHovering={isHovering} />
        {ranges.length > 1 && (
          <Segmented
            value={String(range)}
            onChange={(value) => setRange(value === 'all' ? 'all' : (Number(value) as ChartRange))}
            options={ranges}
            layoutId="stats-chart-range"
            className="[&>button]:px-2.5 [&>button]:text-xs"
          />
        )}
      </div>

      <div className="h-72 md:h-80">
        <div ref={chartContainerRef} className="h-full w-full overflow-hidden" />
      </div>

      <LineGraphLegend entries={legend} />
    </div>
  )
}
