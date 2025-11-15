import { Solve } from '@/interfaces/Solve'
import { Checkbox } from '@/components/ui/checkbox'
import useLineGraphStatistics from '@/features/line-chart-statistics/model/useLineGraphStatistics'

export default function LineGraphStatistics({ solves }: { solves: Solve[] }) {
  const {
    showWorstTime,
    showAverageTime,
    setShowAverageTime,
    showBestTime,
    setShowBestTime,
    setShowWorstTime,
    showStandardDeviation,
    setShowStandardDeviation,
    tooltipRef,
    chartContainerRef
  } = useLineGraphStatistics(solves)

  return (
    <div className="relative w-full">
      <div className="h-96">
        <div ref={chartContainerRef} className="w-full h-full"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-2 text-sm bg-black bg-opacity-80 rounded shadow-lg z-10 text-white"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="best-time" checked={showBestTime} onCheckedChange={(e: boolean) => setShowBestTime(e)} />
          <label
            htmlFor="best-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Best Time
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="worst-time" checked={showWorstTime} onCheckedChange={(e: boolean) => setShowWorstTime(e)} />
          <label
            htmlFor="worst-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Worst Time
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
            Average
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
            Standard Deviation
          </label>
        </div>
      </div>
    </div>
  )
}
