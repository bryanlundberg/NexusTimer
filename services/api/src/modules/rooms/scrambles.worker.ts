import { parentPort } from 'node:worker_threads'
import type { FreePlayEvent } from '@nexustimer/contracts'
import { loadEngine, PUZZLE_BY_CATEGORY } from '@nexustimer/tnoodle-lib-rs/node'

export type ScrambleJob = { id: number; event: FreePlayEvent }
export type ScrambleReply = { id: number; scramble: string }

parentPort?.on('message', ({ id, event }: ScrambleJob) => {
  const scramble = loadEngine().scramble(PUZZLE_BY_CATEGORY[event]).trim()
  parentPort?.postMessage({ id, scramble } satisfies ScrambleReply)
})
