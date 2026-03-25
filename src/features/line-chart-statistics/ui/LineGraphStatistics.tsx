import { Checkbox } from '@/components/ui/checkbox'
import useLineGraphStatistics from '@/features/line-chart-statistics/model/useLineGraphStatistics'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const t = useTranslations('Index')
  const {
    showWorstTime,
    setShowWorstTime,
    showStandardDeviation,
    setShowStandardDeviation,
    tooltipRef,
    chartContainerRef
  } = useLineGraphStatistics(solves)

  return (
    <div className="relative w-full">
      <div className="mb-3 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="worst-time" checked={showWorstTime} onCheckedChange={(e: boolean) => setShowWorstTime(e)} />
          <label
            htmlFor="worst-time"
            className="text-xs font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.worst-time')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="standard-deviation"
            checked={showStandardDeviation}
            onCheckedChange={(e: boolean) => setShowStandardDeviation(e)}
          />
          <label
            htmlFor="standard-deviation"
            className="text-xs font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.standard-deviation')}
          </label>
        </div>
      </div>

      <div className="h-80 md:h-96">
        <div ref={chartContainerRef} className="w-full h-full rounded-lg overflow-hidden"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-3 text-sm bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl z-10 text-popover-foreground"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>
    </div>
  )
}
