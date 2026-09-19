import { Cube } from '@/entities/cube/model/types'
import { DisplayTimerStatistics } from '@/features/deep-statistics/model/types'
import { createTimerStats, timerStatsResult } from '@/features/deep-statistics/lib/timerStatsEngine'

export default function calcStatistics({
  selectedCube,
  cubesDB
}: {
  selectedCube: Cube | null
  cubesDB: Cube[] | null
}): DisplayTimerStatistics {
  return timerStatsResult(createTimerStats(cubesDB, selectedCube))
}
