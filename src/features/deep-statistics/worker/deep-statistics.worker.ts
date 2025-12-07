// <reference lib="webworker" />
import calcAverageStatistics from '@/shared/lib/statistics/calcAverageStatistics'
import calcTimeSpentStatistics from '@/shared/lib/statistics/calcTimeSpentStatistics'
import calcTotalSolvesStatistics from '@/shared/lib/statistics/calcTotalSolvesStatistics'
import calcAoStatistics from '@/shared/lib/statistics/calcAoStatistics'
import calcDeviation from '@/shared/lib/statistics/calcDeviation'
import calcSuccessRate from '@/shared/lib/statistics/calcSuccessRate'
import calcBestTime from '@/shared/lib/statistics/calcBestTime'
import getSolvesMetrics from '@/shared/lib/statistics/getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'

type InMsg = {
  command: 'start'
  data: {
    cubes: Cube[]
    selectedCube: Cube
  }
}

self.onmessage = (event: MessageEvent<InMsg>) => {
  const { command, data } = event.data
  if (command === 'start') {
    if (data.selectedCube) {
      const calculatedAverage = calcAverageStatistics({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedTimeSpent = calcTimeSpentStatistics({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedCounter = calcTotalSolvesStatistics({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedStats = calcAoStatistics({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedDeviation = calcDeviation({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedSuccessRate = calcSuccessRate({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedBest = calcBestTime({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })
      const calculatedData = getSolvesMetrics({
        cubesDB: data.cubes,
        category: data.selectedCube.category,
        cubeName: data.selectedCube.name
      })

      ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
        result: {
          average: calculatedAverage,
          timeSpent: calculatedTimeSpent,
          counter: calculatedCounter,
          stats: calculatedStats,
          deviation: calculatedDeviation,
          successRate: calculatedSuccessRate,
          best: calculatedBest,
          data: calculatedData
        }
      })
    }
  }
}
