import { cn } from '@/shared/lib/utils'
import { CHART_COLORS } from '@/features/line-chart-statistics/model/useLineGraphStatistics'

type LineStyle = 'solid' | 'dashed' | 'dotted'

interface LegendEntry {
  label: string
  color: string
  style?: LineStyle
  visible: boolean
}

interface LineGraphLegendProps {
  primaryLabel: string
  showBestTime: boolean
  showWorstTime: boolean
  showAo5: boolean
  showAo12: boolean
  showStandardDeviation: boolean
}

export default function LineGraphLegend({
  primaryLabel,
  showBestTime,
  showWorstTime,
  showAo5,
  showAo12,
  showStandardDeviation
}: LineGraphLegendProps) {
  const entries: LegendEntry[] = [
    { label: primaryLabel, color: 'var(--primary)', style: 'solid', visible: true },
    { label: 'PB', color: CHART_COLORS.pb, style: 'dashed', visible: showBestTime },
    { label: 'Ao5', color: CHART_COLORS.ao5, style: 'solid', visible: showAo5 },
    { label: 'Ao12', color: CHART_COLORS.ao12, style: 'solid', visible: showAo12 },
    { label: 'Worst', color: CHART_COLORS.worst, style: 'solid', visible: showWorstTime },
    { label: 'σ', color: CHART_COLORS.sd, style: 'dotted', visible: showStandardDeviation }
  ]

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3">
      {entries
        .filter((e) => e.visible)
        .map((entry) => (
          <div key={entry.label} className={cn('legend-notch flex items-center gap-1.5 px-2.5 py-1 text-[11px]')}>
            <span
              className="inline-block w-3 h-[2px] rounded-full"
              style={{
                background:
                  entry.style === 'dashed'
                    ? `repeating-linear-gradient(to right, ${entry.color} 0 3px, transparent 3px 5px)`
                    : entry.style === 'dotted'
                      ? `repeating-linear-gradient(to right, ${entry.color} 0 1.5px, transparent 1.5px 3px)`
                      : entry.color
              }}
            />
            <span className="text-muted-foreground font-medium tabular-nums">{entry.label}</span>
          </div>
        ))}
    </div>
  )
}
