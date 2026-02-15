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
      const sendPartial = (key: string, value: any) => {
        ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
          partial: true,
          key,
          value
        })
      }

      sendPartial(
        'average',
        calcAverageStatistics({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'timeSpent',
        calcTimeSpentStatistics({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'counter',
        calcTotalSolvesStatistics({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'stats',
        calcAoStatistics({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'deviation',
        calcDeviation({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'successRate',
        calcSuccessRate({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'best',
        calcBestTime({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )

      sendPartial(
        'data',
        getSolvesMetrics({
          cubesDB: data.cubes,
          category: data.selectedCube.category,
          cubeName: data.selectedCube.name
        })
      )
      ;(self as unknown as DedicatedWorkerGlobalScope).postMessage({
        done: true
      })
    }
  }
}
