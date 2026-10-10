import { Worker } from 'node:worker_threads'
import type { FreePlayEvent } from '@nexustimer/contracts'
import { loadEngine, PUZZLE_BY_CATEGORY } from '@nexustimer/tnoodle-lib-rs/node'
import type { ScrambleJob, ScrambleReply } from './scrambles.worker'

const SLOW_EVENTS: ReadonlySet<FreePlayEvent> = new Set(['4x4', 'FTO'])

const WORKER_URL = new URL(
  import.meta.url.endsWith('.ts') ? './scrambles.worker.ts' : './scrambles.worker.js',
  import.meta.url
)

export type ScrambleGenerator = (event: FreePlayEvent, count: number) => Promise<string[]>

export type SlowScrambler = (event: FreePlayEvent) => Promise<string>

type Job = { resolve: (scramble: string) => void; reject: (error: unknown) => void }

export function createWorkerScrambler(url: URL): SlowScrambler {
  let current: { worker: Worker; jobs: Map<number, Job> } | null = null
  let nextId = 0

  const spawn = () => {
    const worker = new Worker(url)
    const jobs = new Map<number, Job>()
    const retire = (error: unknown) => {
      if (current?.worker === worker) current = null
      for (const job of jobs.values()) job.reject(error)
      jobs.clear()
    }
    worker.on('message', ({ id, scramble }: ScrambleReply) => {
      jobs.get(id)?.resolve(scramble)
      jobs.delete(id)
      if (jobs.size === 0) worker.unref()
    })
    worker.on('error', retire)
    worker.on('exit', (code) => retire(new Error(`scramble worker exited with code ${code}`)))
    return { worker, jobs }
  }

  return (event) =>
    new Promise((resolve, reject) => {
      current ??= spawn()
      const id = nextId++
      current.jobs.set(id, { resolve, reject })
      current.worker.ref()
      current.worker.postMessage({ id, event } satisfies ScrambleJob)
    })
}

export function createScrambleGenerator(slow: SlowScrambler): ScrambleGenerator {
  return async (event, count) => {
    if (SLOW_EVENTS.has(event)) {
      const scramble = await slow(event)
      return scramble ? [scramble] : []
    }
    const engine = loadEngine()
    const puzzle = PUZZLE_BY_CATEGORY[event]
    const scrambles: string[] = []
    for (let i = 0; i < count; i++) {
      const scramble = engine.scramble(puzzle).trim()
      if (scramble) scrambles.push(scramble)
    }
    return scrambles
  }
}

export const generateScrambles = createScrambleGenerator(createWorkerScrambler(WORKER_URL))
