// <reference lib="webworker" />
import { calcAverageFromMetrics } from '@/shared/lib/statistics/calcAverageStatistics'
import { calcTimeSpentFromMetrics } from '@/shared/lib/statistics/calcTimeSpentStatistics'
import { calcTotalSolvesFromMetrics } from '@/shared/lib/statistics/calcTotalSolvesStatistics'
import { calcAoFromMetrics } from '@/shared/lib/statistics/calcAoStatistics'
import { calcDeviationFromMetrics } from '@/shared/lib/statistics/calcDeviation'
import { calcSuccessRateFromMetrics } from '@/shared/lib/statistics/calcSuccessRate'
import { calcBestTimeFromMetrics } from '@/shared/lib/statistics/calcBestTime'
import { columnsToMetrics, CubeSolveColumns } from '@/features/deep-statistics/lib/solveColumns'

type InMsg = {
  command: 'start'
  requestId: number
  data: CubeSolveColumns
}

self.onmessage = (event: MessageEvent<InMsg>) => {
  const { command, requestId, data } = event.data
  if (command === 'start') {
    if (data) {
      const sendPartial = (key: string, value: any) => {
        ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
          requestId,
          partial: true,
          key,
          value
        })
      }

      const metrics = columnsToMetrics(data)

      sendPartial('average', calcAverageFromMetrics(metrics))
      sendPartial('timeSpent', calcTimeSpentFromMetrics(metrics))
      sendPartial('counter', calcTotalSolvesFromMetrics(metrics))
      sendPartial('stats', calcAoFromMetrics(metrics))
      sendPartial('deviation', calcDeviationFromMetrics(metrics))
      sendPartial('successRate', calcSuccessRateFromMetrics(metrics))
      sendPartial('best', calcBestTimeFromMetrics(metrics))
      ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
        requestId,
        done: true
      })
    }
  }
}
