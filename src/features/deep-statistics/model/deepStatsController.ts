import {
  defaultChartAoValues,
  defaultChartValuesA,
  defaultChartValuesN,
  defaultChartValuesS
} from '@/features/deep-statistics/model/defaultChartValues'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

export type DeepStatsState = {
  stats: {
    average: typeof defaultChartValuesN
    timeSpent: typeof defaultChartValuesS
    counter: typeof defaultChartValuesN
    stats: typeof defaultChartAoValues
    deviation: typeof defaultChartValuesN
    successRate: typeof defaultChartValuesS
    best: typeof defaultChartValuesN
    data: typeof defaultChartValuesA
  }
  loadingProps: Record<string, boolean>
}

const initialState: DeepStatsState = {
  stats: {
    average: defaultChartValuesN,
    timeSpent: defaultChartValuesS,
    counter: defaultChartValuesN,
    stats: defaultChartAoValues,
    deviation: defaultChartValuesN,
    successRate: defaultChartValuesS,
    best: defaultChartValuesN,
    data: defaultChartValuesA
  },
  loadingProps: {
    average: true,
    timeSpent: true,
    counter: true,
    stats: true,
    deviation: true,
    successRate: true,
    best: true,
    data: true
  }
}

let state: DeepStatsState = initialState
let worker: Worker | null = null
let nextRequestId = 0
let activeRequestId = -1
let lastCubesRef: Cube[] | null = null
let lastSelectedRef: Cube | null = null
let lastStartTimestamp = Number.NaN

const subscribers = new Set<() => void>()
const SERVER_SNAPSHOT = initialState

function notify() {
  subscribers.forEach((cb) => cb())
}

function setState(next: DeepStatsState) {
  state = next
  notify()
}

function getWorker(): Worker | null {
  if (typeof window === 'undefined') return null
  if (worker) return worker

  worker = new Worker(new URL('../worker/deep-statistics.worker.ts', import.meta.url), { type: 'module' })

  worker.onmessage = (event: MessageEvent) => {
    const { requestId, partial, done, key, value } = event.data
    if (requestId !== activeRequestId) return

    if (partial) {
      setState({
        stats: { ...state.stats, [key]: value },
        loadingProps: { ...state.loadingProps, [key]: false }
      })
    } else if (done) {
      setState({
        stats: state.stats,
        loadingProps: {
          average: false,
          timeSpent: false,
          counter: false,
          stats: false,
          deviation: false,
          successRate: false,
          best: false,
          data: false
        }
      })
    }
  }

  worker.onerror = (err) => {
    console.error('deep-stats worker error:', err)
  }

  return worker
}

function filterSolves(solves: Solve[] | undefined, startTimestamp: number): Solve[] {
  if (!solves) return []
  const nonDeleted = solves.filter((s) => !s.isDeleted)
  if (!startTimestamp || startTimestamp <= 0) return nonDeleted
  return nonDeleted.filter((s) => {
    const ts = s.endTime ?? s.startTime
    return ts >= startTimestamp
  })
}

export function subscribe(cb: () => void) {
  subscribers.add(cb)
  return () => {
    subscribers.delete(cb)
  }
}

export function getSnapshot(): DeepStatsState {
  return state
}

export function getServerSnapshot(): DeepStatsState {
  return SERVER_SNAPSHOT
}

export function requestDeepStats(cubes: Cube[] | null, selectedCube: Cube | null, startTimestamp: number): void {
  const w = getWorker()
  if (!w) return
  if (!selectedCube || !cubes) return

  if (cubes === lastCubesRef && selectedCube === lastSelectedRef && startTimestamp === lastStartTimestamp) {
    return
  }

  lastCubesRef = cubes
  lastSelectedRef = selectedCube
  lastStartTimestamp = startTimestamp

  const filteredCubes = cubes.map((c) => ({
    ...c,
    solves: {
      session: filterSolves(c.solves?.session, startTimestamp),
      all: filterSolves(c.solves?.all, startTimestamp)
    }
  }))

  const filteredSelected = {
    ...selectedCube,
    solves: {
      session: filterSolves(selectedCube.solves?.session, startTimestamp),
      all: filterSolves(selectedCube.solves?.all, startTimestamp)
    }
  } as Cube

  activeRequestId = ++nextRequestId

  setState({
    stats: initialState.stats,
    loadingProps: { ...initialState.loadingProps }
  })

  w.postMessage({
    command: 'start',
    requestId: activeRequestId,
    data: {
      cubes: filteredCubes,
      selectedCube: filteredSelected
    }
  })
}
