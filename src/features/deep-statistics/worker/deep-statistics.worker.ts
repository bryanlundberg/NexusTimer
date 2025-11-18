// <reference lib="webworker" />
import calcAverageStatistics from '@/lib/calcAverageStatistics'
import calcTimeSpentStatistics from '@/lib/calcTimeSpentStatistics'
import calcTotalSolvesStatistics from '@/lib/calcTotalSolvesStatistics'
import calcAoStatistics from '@/lib/calcAoStatistics'
import calcDeviation from '@/lib/calcDeviation'
import calcSuccessRate from '@/lib/calcSuccessRate'
import calcBestTime from '@/lib/calcBestTime'
import getSolvesMetrics from '@/lib/getSolvesMetrics'
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
