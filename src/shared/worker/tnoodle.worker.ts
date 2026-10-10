import { loadEngine, type PuzzleKey } from '@nexustimer/tnoodle-lib-rs/web'

type InMsg = { id: number; puzzle: PuzzleKey }

type OutMsg = { id: number; scramble: string | null }

const scope = self as unknown as DedicatedWorkerGlobalScope

loadEngine().catch(() => {})

self.onmessage = async (event: MessageEvent<InMsg>) => {
  const { id, puzzle } = event.data
  let scramble: string | null = null
  try {
    scramble = (await loadEngine()).scramble(puzzle)
  } catch {}
  scope.postMessage({ id, scramble } satisfies OutMsg)
}
