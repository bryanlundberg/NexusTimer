import getSolvesMetrics from './getSolvesMetrics'
import calcPenaltyRate from './calcPenaltyRate'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'

export default function calcSuccessRate({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<string> {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName
  })

  const globalRate = calcPenaltyRate(global)
  const sessionRate = calcPenaltyRate(session)
  const cubeAllRate = calcPenaltyRate(cubeAll)
  const cubeSessionRate = calcPenaltyRate(cubeSession)

  return {
    global: calculatePercentage(globalRate, global.length),
    session: calculatePercentage(sessionRate, session.length),
    cubeAll: calculatePercentage(cubeAllRate, cubeAll.length),
    cubeSession: calculatePercentage(cubeSessionRate, cubeSession.length)
  }
}

/**
 * The `calculatePercentage` function calculates the percentage of completion based on a rate and length.
 * @param {number} rate - The rate parameter represents the number of occurrences or events that have
 * happened.
 * @param {number} length - The length parameter represents the total number of items.
 * @returns a string representation of the calculated percentage.
 */

function calculatePercentage(rate: number, length: number): string {
  return length === 0 ? '100' : (100 - (rate * 100) / length).toFixed(2)
}
