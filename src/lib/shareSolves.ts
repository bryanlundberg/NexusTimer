import formatTime from '../shared/lib/formatTime'
import calculateCurrentAo from '../shared/lib/statistics/calculateCurrentAo'
import { Solve } from '@/entities/solve/model/types'

export function shareSolves({ solves }: { solves: Solve[] }) {
  // retrieving last n solves
  const last5Solves = solves.slice(0, 5)
  const last12Solves = solves.slice(0, 12)

  // finding average of last n solves
  const Ao5 = calculateCurrentAo(last5Solves, 5)
  const Ao12 = calculateCurrentAo(last12Solves, 12)

  // formatting last averages
  const formattedAo5 = Ao5 ? `${formatTime(Ao5).split('.')[0]}.${formatTime(Ao5).split('.')[1]}` : '0.0'

  const formattedAo12 = Ao12 ? `${formatTime(Ao12).split('.')[0]}.${formatTime(Ao12).split('.')[1]}` : '0.0'

  // finding max and min time in respective solves
  let maxTimeAo5 = -Infinity
  let minTimeAo5 = Infinity

  let maxTimeAo12 = -Infinity
  let minTimeAo12 = Infinity

  for (let i = 0; i < last5Solves.length; i++) {
    maxTimeAo5 = Math.max(maxTimeAo5, last5Solves[i].time)
    minTimeAo5 = Math.min(minTimeAo5, last5Solves[i].time)
  }

  for (let i = 0; i < last12Solves.length; i++) {
    maxTimeAo12 = Math.max(maxTimeAo12, last12Solves[i].time)
    minTimeAo12 = Math.min(minTimeAo12, last12Solves[i].time)
  }

  // formatting each solves
  const formattedLast5Solves = last5Solves
    .map((solve, index) => {
      const time = `${formatTime(solve.time).split('.')[0]}.${formatTime(solve.time).split('.')[1]}`
      const scramble = `${solve.scramble}`

      if (solve.time === maxTimeAo5 || solve.time === minTimeAo5) {
        return `${Array(4).join(' ')}${index + 1}. (${time}) ${scramble}`
      } else return `${Array(4).join(' ')}${index + 1}. ${time} ${scramble}`
    })
    .join('\n')

  const formattedLast12Solves = last12Solves
    .map((solve, index) => {
      const time = `${formatTime(solve.time).split('.')[0]}.${formatTime(solve.time).split('.')[1]}`
      const scramble = `${solve.scramble}`

      if (solve.time === maxTimeAo12 || solve.time === minTimeAo12) {
        return `${Array(4).join(' ')}${index + 1}. (${time}) ${scramble}`
      } else return `${Array(4).join(' ')}${index + 1}. ${time} ${scramble}`
    })
    .join('\n')

  return {
    formattedAo5,
    formattedAo12,
    formattedLast5Solves,
    formattedLast12Solves
  }
}
