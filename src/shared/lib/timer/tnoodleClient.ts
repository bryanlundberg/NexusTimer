import type { PuzzleKey } from '@nexustimer/tnoodle-lib-rs'

type WorkerRequest = { id: number; puzzle: PuzzleKey }
type WorkerResponse = { id: number; scramble: string | null }

let workerInstance: Worker | null = null
let nextRequestId = 0
const pending = new Map<number, (scramble: string | null) => void>()

function settleAll() {
  for (const resolve of pending.values()) resolve(null)
  pending.clear()
}

function resetWorker() {
  workerInstance?.terminate()
  workerInstance = null
  settleAll()
}

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return null
  if (workerInstance) return workerInstance

  const worker = new Worker(new URL('../../worker/tnoodle.worker.ts', import.meta.url), { type: 'module' })

  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { id, scramble } = event.data
    const resolve = pending.get(id)
    if (resolve) {
      pending.delete(id)
      resolve(scramble)
    }
    if (scramble === null && worker === workerInstance) resetWorker()
  }

  worker.onerror = () => {
    if (worker === workerInstance) resetWorker()
  }

  workerInstance = worker
  return worker
}

export function requestScramble(puzzle: PuzzleKey): Promise<string | null> {
  const worker = getWorker()
  if (!worker) return Promise.resolve(null)
  return new Promise((resolve) => {
    const id = nextRequestId++
    pending.set(id, resolve)
    worker.postMessage({ id, puzzle } satisfies WorkerRequest)
  })
}
