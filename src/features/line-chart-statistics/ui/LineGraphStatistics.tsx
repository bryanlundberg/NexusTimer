import useLineGraphStatistics from '@/features/line-chart-statistics/model/useLineGraphStatistics'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import LineGraphLegend from './LineGraphLegend'

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const t = useTranslations('Index')
  const { showBestTime, showWorstTime, showAo5, showAo12, showStandardDeviation, tooltipRef, chartContainerRef } =
    useLineGraphStatistics(solves)

  return (
    <div className="relative w-full">
      <div className="h-80 md:h-96">
        <div ref={chartContainerRef} className="w-full h-full rounded-lg overflow-hidden"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-2.5 bg-popover/95 backdrop-blur-md border border-border/50 rounded-xs shadow-xl z-10 text-popover-foreground"
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
