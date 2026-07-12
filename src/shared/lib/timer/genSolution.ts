import { Layers } from '@/shared/types/enums'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CrossSolution } from '@/shared/types/types'

export type SolveTask = { scramble: string; type: 'cross' | 'xcross' | 'kociemba' }
type WorkerRequest = { id: number; tasks: SolveTask[] }
type WorkerResponse = { id: number; results: string[] }

let workerInstance: Worker | null = null
let nextRequestId = 0
const pending = new Map<number, (results: string[]) => void>()

function getWorker(): Worker | null {
  if (typeof window === 'undefined') return null
  if (workerInstance) return workerInstance

  workerInstance = new Worker(new URL('../../worker/cube-solver.worker.ts', import.meta.url), { type: 'module' })

  workerInstance.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { id, results } = event.data
    const callback = pending.get(id)
    if (callback) {
      pending.delete(id)
      callback(results)
    }
  }

  return workerInstance
}

/**
 * Eagerly instantiates the cube-solver worker so its Kociemba pruning tables
 * are built off the main thread, before the first user interaction.
 */
export function prewarmSolver(): void {
  getWorker()
}

/**
 * Generic bridge to the cube-solver worker: runs a batch of solve tasks and
 * resolves to their solutions (same order). Returns empty strings when no
 * worker is available (SSR). Used by both cross/xcross generation and the
 * trainer's transition solver.
 */
export function solveTasks(tasks: SolveTask[]): Promise<string[]> {
  const worker = getWorker()
  if (!worker) return Promise.resolve(tasks.map(() => ''))
  return new Promise<string[]>((resolve) => {
    const id = nextRequestId++
    pending.set(id, resolve)
    worker.postMessage({ id, tasks } satisfies WorkerRequest)
  })
}

export default function genSolution(
  event: CubeCategory,
  scramble: string | null,
  layer: Layers
): Promise<CrossSolution> {
  const empty: CrossSolution = { cross: [], xcross: [], fb: [], eoline: [] }

  if (event !== '3x3' && event !== '3x3 OH') return Promise.resolve(empty)
  if (layer !== Layers.YELLOW) return Promise.resolve(empty)
  if (!getWorker()) return Promise.resolve(empty)

  const rotations = ['', 'y', 'y y', "y'"]
  const buildScramble = (rot: string) => (rot ? `${rot} ${scramble}` : `${scramble}`)
  const tasks: SolveTask[] = [
    ...rotations.map((r) => ({ scramble: buildScramble(r), type: 'cross' as const })),
    ...rotations.map((r) => ({ scramble: buildScramble(r), type: 'xcross' as const }))
  ]

  return solveTasks(tasks).then((results) => ({
    cross: results.slice(0, 4),
    xcross: results.slice(4, 8),
    fb: [],
    eoline: []
  }))
}
