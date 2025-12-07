import { sort } from 'fast-sort'
import calculateBestAo from '../../../shared/lib/statistics/calculateBestAo'
import calculateCurrentAo from '../../../shared/lib/statistics/calculateCurrentAo'
import getDeviation from '../../../shared/lib/statistics/getDeviation'
import getMean from '../../../shared/lib/statistics/getMean'
import getSolvesMetrics from '../../../shared/lib/statistics/getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { defaultTimerStatistics } from '@/shared/model/timer/defaultTimerStatistics'
import { CubeStatistics, DisplayTimerStatistics } from '@/features/deep-statistics/model/types'

/**
 * Calculates various statistics for a cube solving session, including
 * best time, average of X solves, deviation, and mean.
 * @param {Object} params - The parameters for calculating statistics.
 * @param {Cube | null} params.selectedCube - The cube object for which statistics will be calculated.
 * @param {Cube[] | null} params.cubesDB - The array of cubes.
 * @returns {DisplayTimerStatistics} An object containing the calculated statistics for global, session, and cubeSession.
 */
export default function calcStatistics({
  selectedCube,
  cubesDB
}: {
  selectedCube: Cube | null
  cubesDB: Cube[] | null
}): DisplayTimerStatistics {
  // Early return if selectedCube is null
  if (!selectedCube) {
    return {
      global: defaultTimerStatistics,
      session: defaultTimerStatistics,
      cubeSession: defaultTimerStatistics
    }
  }

  // Reusable function for calculating statistics
  const calculateStatistics = (solves: Solve[], type: string): CubeStatistics => {
    // Filter out DNF solves for best time calculation
    const validSolves = solves.filter((solve) => !solve.dnf)
    const pbSolves = sort(validSolves).asc((solve) => solve.time)

    // Default object with initial values
    const statistics: CubeStatistics = {
      count: solves.length,
      best: validSolves.length > 0 ? pbSolves[0]?.time || 0 : 0,
      deviation: getDeviation(solves),
      mean: getMean(solves),
      ao3: 0,
      ao5: 0,
      ao12: 0,
      ao50: 0,
      ao100: 0,
      worst: solves.some((solve) => solve.dnf) ? 0 : pbSolves[pbSolves.length - 1]?.time || 0
    }

    // Calculate average of X (AoX) statistics
    const aoValues = [3, 5, 12, 50, 100]
    for (const aoValue of aoValues) {
      statistics[`ao${aoValue}` as keyof CubeStatistics] =
        type === 'global' ? calculateBestAo(solves, aoValue) : calculateCurrentAo(solves, aoValue)
    }

    return statistics
  }

  // Get solve metrics for global, session, and cubeSession
  const { global, session, cubeSession } = getSolvesMetrics({
    cubesDB,
    category: selectedCube.category,
    cubeName: selectedCube.name
  })

  // Calculate and return statistics for global, session, and cubeSession
  return {
    global: global.length > 0 ? calculateStatistics(global, 'global') : defaultTimerStatistics,
    session: session.length > 0 ? calculateStatistics(session, 'session') : defaultTimerStatistics,
    cubeSession: cubeSession.length > 0 ? calculateStatistics(cubeSession, 'cubeSession') : defaultTimerStatistics
  }
}
