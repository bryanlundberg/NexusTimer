import { PUZZLE_BY_CATEGORY, type PuzzleKey } from '@nexustimer/tnoodle-lib-rs'
import type { CubeCategory } from '@/shared/const/cube-categories'
import { requestScramble } from '@/shared/lib/timer/tnoodleClient'

type ScrambleRequest = (puzzle: PuzzleKey) => Promise<string | null>
type ReadyListener = (puzzle: PuzzleKey) => void

export function createScramblePool(request: ScrambleRequest, size = 2) {
  const ready = new Map<PuzzleKey, string[]>()
  const inFlight = new Map<PuzzleKey, number>()
  const listeners = new Set<ReadyListener>()

  const refill = (puzzle: PuzzleKey) => {
    const queue = ready.get(puzzle) ?? []
    ready.set(puzzle, queue)
    const missing = size - queue.length - (inFlight.get(puzzle) ?? 0)
    for (let i = 0; i < missing; i++) {
      inFlight.set(puzzle, (inFlight.get(puzzle) ?? 0) + 1)
      request(puzzle)
        .catch(() => null)
        .then((scramble) => {
          inFlight.set(puzzle, (inFlight.get(puzzle) ?? 1) - 1)
          if (!scramble) return
          queue.push(scramble)
          for (const listener of listeners) listener(puzzle)
        })
    }
  }

  const takeScramble = (category: CubeCategory): string | null => {
    const puzzle = PUZZLE_BY_CATEGORY[category]
    if (!puzzle) return null
    const scramble = ready.get(puzzle)?.shift() ?? null
    refill(puzzle)
    return scramble
  }

  const onScrambleReady = (listener: ReadyListener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { takeScramble, onScrambleReady }
}

export const { takeScramble, onScrambleReady } = createScramblePool(requestScramble)
