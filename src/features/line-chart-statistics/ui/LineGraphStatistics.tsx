import { Checkbox } from '@/components/ui/checkbox'
import useLineGraphStatistics from '@/features/line-chart-statistics/model/useLineGraphStatistics'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const t = useTranslations('Index')
  const {
    showWorstTime,
    showAverageTime,
    setShowAverageTime,
    showBestTime,
    setShowBestTime,
    setShowWorstTime,
    showAo5,
    setShowAo5,
    showAo12,
    setShowAo12,
    showStandardDeviation,
    setShowStandardDeviation,
    tooltipRef,
    chartContainerRef
  } = useLineGraphStatistics(solves)

  return (
    <div className="relative w-full">
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="best-time" checked={showBestTime} onCheckedChange={(e: boolean) => setShowBestTime(e)} />
          <label
            htmlFor="best-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.best-time')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="worst-time" checked={showWorstTime} onCheckedChange={(e: boolean) => setShowWorstTime(e)} />
          <label
            htmlFor="worst-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.worst-time')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="average-time"
            checked={showAverageTime}
            onCheckedChange={(e: boolean) => setShowAverageTime(e)}
          />
          <label
            htmlFor="average-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.average')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="ao5" checked={showAo5} onCheckedChange={(e: boolean) => setShowAo5(e)} />
          <label
            htmlFor="ao5"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ao5
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="ao12" checked={showAo12} onCheckedChange={(e: boolean) => setShowAo12(e)} />
          <label
            htmlFor="ao12"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ao12
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('StatsPage.standard-deviation')}
          </label>
        </div>
      </div>

      <div className="h-96">
        <div ref={chartContainerRef} className="w-full h-full"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-2 text-sm bg-black bg-opacity-80 rounded shadow-lg z-10 text-white"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>
    </div>
  )
}
