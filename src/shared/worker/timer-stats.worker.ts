// <reference lib="webworker" />
import {
  appendTimerStats,
  createTimerStats,
  TimerStatsState,
  timerStatsResult
} from '@/features/deep-statistics/lib/timerStatsEngine'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

type InMsg =
  | { command: 'reset'; data: { cubes: Cube[]; selectedCube: Cube | null } }
  | { command: 'append'; data: { cubeId: string; solves: Solve[] } }

let state: TimerStatsState | null = null
const scope = self as unknown as DedicatedWorkerGlobalScope

self.onmessage = (event: MessageEvent<InMsg>) => {
  const message = event.data
  if (message.command === 'reset') {
    state = createTimerStats(message.data.cubes, message.data.selectedCube)
  } else if (message.command === 'append') {
    const next = state && appendTimerStats(state, message.data.cubeId, message.data.solves)
    if (!next) {
      scope.postMessage({ resync: true })
      return
    }
    state = next
  }
  scope.postMessage({ result: timerStatsResult(state) })
}
