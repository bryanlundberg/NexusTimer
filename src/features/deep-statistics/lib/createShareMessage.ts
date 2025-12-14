import getMean from '../../../shared/lib/statistics/getMean'
import getWorstTime from '../../../shared/lib/statistics/getWorstTime'
import getBestTime from '../../../shared/lib/statistics/getBestTime'
import getDeviation from '../../../shared/lib/statistics/getDeviation'
import formatTime from '../../../shared/lib/formatTime'
import { SolveTab } from '@/shared/types/enums'
import { Solve } from '@/entities/solve/model/types'

interface createShareMessage {
  type: 'all' | '3' | '5' | '12' | '50' | '100'
  solves: Solve[] | null
  translations: {
    statsTitle: string
    avg: string
    listOfTimes: string
    date: string
  }
}

export function createShareMessage({
  type,
  solves,
  translations: { statsTitle, avg, listOfTimes, date }
}: createShareMessage): string {
  if (!solves || solves.length === 0) return ''

  const dataSet: Solve[] = [...solves]
  dataSet.sort((a, b) => b.endTime - a.endTime)

  if (type !== SolveTab.ALL) {
    const solveCount = Number(type)
    dataSet.splice(solveCount)
  }

  const average = getMean([...dataSet])
  const worstTime = getWorstTime([...dataSet])
  const bestTime = getBestTime({ solves: [...dataSet] })
  const deviation = getDeviation([...dataSet])

  // Header
  let content = `${statsTitle}: ${date}`

  // Summary
  content += `\n${avg} ${dataSet.length}: ${formatTime(average)} (σ = ${formatTime(deviation)})`

  // Space row
  content += `\n\n`

  // Subtitle
  content += listOfTimes

  // Space row
  content += `\n\n`

  // Format solves
  const formattedDataSet = dataSet
    .map((solve, index) => {
      const highlight = solve.time === worstTime || solve.time === bestTime
      const formattedTime = `${highlight ? '(' : ''}${formatTime(
        solve.time
      )}${solve.plus2 ? '+' : ''}${highlight ? ')' : ''}`
      return `${index + 1}. ${solve?.dnf ? 'DNF' : formattedTime} ${solve.scramble}`
    })
    .join('\n')

  // Attach dataset
  content += formattedDataSet

  return content
}
