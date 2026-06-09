import getMean from '@/shared/lib/statistics/getMean'
import getWorstTime from '@/shared/lib/statistics/getWorstTime'
import getBestTime from '@/shared/lib/statistics/getBestTime'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'

interface createShareMessage {
  type: 'all' | '3' | '5' | '12' | '50' | '100'
  solves: Solve[] | null
  translations: {
    statsTitle: string
    listOfTimes: string
    date: string
  }
}

export function createShareMessage({
  type,
  solves,
  translations: { statsTitle, listOfTimes, date }
}: createShareMessage): string {
  if (!solves || solves.length === 0) return ''

  const dataSet: Solve[] = [...solves]
  dataSet.sort((a, b) => b.endTime - a.endTime)

  if (type !== 'all') {
    const solveCount = Number(type)
    dataSet.splice(solveCount)
  }

  const mean = getMean([...dataSet])
  const worstTime = getWorstTime([...dataSet])
  const bestTime = getBestTime({ solves: [...dataSet] })
  const deviation = getDeviation([...dataSet])

  // Header
  let content = `${statsTitle}: ${date}`

  // Summary: plain average, still labeled as Ao
  const aoLabel = mean === 0 ? 'DNF' : formatTime(mean)
  content += `\nAo${dataSet.length}: ${aoLabel} (σ = ${formatTime(deviation)})`

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
