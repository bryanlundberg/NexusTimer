import useLineGraphStatistics, { CHART_COLORS } from '@/features/line-chart-statistics/model/useLineGraphStatistics'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import LineGraphLegend from './LineGraphLegend'
import { cn } from '@/shared/lib/utils'

function TogglePill({
  active,
  color,
  label,
  onClick
}: {
  active: boolean
  color: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors',
        active
          ? 'border-border bg-muted/60 text-foreground'
          : 'border-border/40 bg-transparent text-muted-foreground/70 hover:text-muted-foreground'
      )}
    >
      <span
        className="inline-block size-2 rounded-full transition-opacity"
        style={{ background: color, opacity: active ? 1 : 0.35 }}
      />
      {label}
    </button>
  )
}

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const t = useTranslations('Index')
  const {
    showBestTime,
    showWorstTime,
    setShowWorstTime,
    showAo5,
    showAo12,
    showStandardDeviation,
    setShowStandardDeviation,
    tooltipRef,
    chartContainerRef
  } = useLineGraphStatistics(solves)

  return (
    <div className="relative w-full">
      <div className="mb-3 flex flex-wrap gap-1.5">
        <TogglePill
          active={showWorstTime}
          color={CHART_COLORS.worst}
          label={t('StatsPage.worst-time')}
          onClick={() => setShowWorstTime(!showWorstTime)}
        />
        <TogglePill
          active={showStandardDeviation}
          color={CHART_COLORS.sd}
          label={t('StatsPage.standard-deviation')}
          onClick={() => setShowStandardDeviation(!showStandardDeviation)}
        />
      </div>

      <div className="h-80 md:h-96">
        <div ref={chartContainerRef} className="w-full h-full rounded-lg overflow-hidden"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-2.5 bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl z-10 text-popover-foreground"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>

      <LineGraphLegend
        primaryLabel={t('StatsPage.title')}
        showBestTime={showBestTime}
        showWorstTime={showWorstTime}
        showAo5={showAo5}
        showAo12={showAo12}
        showStandardDeviation={showStandardDeviation}
      />
    </div>
  )
}
