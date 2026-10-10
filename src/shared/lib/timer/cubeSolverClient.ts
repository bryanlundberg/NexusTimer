import type { CrossHint } from '@nexustimer/cube-solver-rs'

export type SolverTask =
  { kind: 'hints'; scramble: string } | { kind: 'transition'; history: string; setup: string; goal: string }

export type SolverRequest = { id: number; task: SolverTask }

export type SolverResponse = { id: number; value: CrossHint[] | string | null; fatal: boolean }

let workerInstance: Worker | null = null
let nextRequestId = 0
const pending = new Map<number, (value: CrossHint[] | string | null) => void>()

function resetWorker() {
  workerInstance?.terminate()
  workerInstance = null
  for (const resolve of pending.values()) resolve(null)
  pending.clear()
}

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return null
  if (workerInstance) return workerInstance

  const worker = new Worker(new URL('../../worker/cube-solver.worker.ts', import.meta.url), { type: 'module' })

  worker.onmessage = (event: MessageEvent<SolverResponse>) => {
    const { id, value, fatal } = event.data
    const resolve = pending.get(id)
    if (resolve) {
      pending.delete(id)
      resolve(value)
    }
    if (fatal && worker === workerInstance) resetWorker()
  }

  worker.onerror = () => {
    if (worker === workerInstance) resetWorker()
  }

  workerInstance = worker
  return worker
}

function request(task: SolverTask): Promise<CrossHint[] | string | null> {
  const worker = getWorker()
  if (!worker) return Promise.resolve(null)
  return new Promise((resolve) => {
    const id = nextRequestId++
    pending.set(id, resolve)
    worker.postMessage({ id, task } satisfies SolverRequest)
  })
}

export function requestCrossHints(scramble: string): Promise<CrossHint[] | null> {
  return request({ kind: 'hints', scramble }).then((value) => (Array.isArray(value) ? value : null))
}

export function requestTransition(history: string, setup: string, goal: string): Promise<string | null> {
  return request({ kind: 'transition', history, setup, goal }).then((value) =>
    typeof value === 'string' ? value : null
  )
}

export function prewarmSolver(): void {
  void requestCrossHints('')
}
