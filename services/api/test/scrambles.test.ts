import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { FREE_PLAY_EVENTS, type FreePlayEvent } from '@nexustimer/contracts'
import { build } from 'esbuild'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createScrambleGenerator, createWorkerScrambler } from '../src/modules/rooms/scrambles.service'
import { buildTestApp, TEST_EDGE_SECRET, testEnv } from './helpers'

const SECRET = 'test-realtime-secret'

const requestScrambles = (app: ReturnType<typeof buildTestApp>, body: unknown, authorization = `Bearer ${SECRET}`) =>
  app.request('/api/internal/scrambles', {
    method: 'POST',
    headers: { authorization, 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })

describe('POST /api/internal/scrambles', () => {
  const env = testEnv({ REALTIME_SECRET: SECRET, EDGE_SECRET: TEST_EDGE_SECRET })

  it('answers the gateway without the edge secret', async () => {
    const asked: [FreePlayEvent, number][] = []
    const app = buildTestApp({
      env,
      scrambles: async (event, count) => {
        asked.push([event, count])
        return ["R U R' U'"]
      }
    })

    const res = await requestScrambles(app, { event: 'SQ1', count: 3 })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ scrambles: ["R U R' U'"] })
    expect(asked).toEqual([['SQ1', 3]])
  })

  it('rejects a missing or wrong realtime secret', async () => {
    const app = buildTestApp({ env })

    expect((await requestScrambles(app, { event: '3x3', count: 1 }, '')).status).toBe(401)
    expect((await requestScrambles(app, { event: '3x3', count: 1 }, 'Bearer nope')).status).toBe(401)
  })

  it('rejects events free play does not offer and counts out of range', async () => {
    const app = buildTestApp({ env })

    for (const body of [
      { event: 'square1', count: 1 },
      { event: '3x3', count: 0 },
      { event: '3x3', count: 11 }
    ]) {
      expect((await requestScrambles(app, body)).status).toBe(400)
    }
  })

  it('answers 503 when realtime is not configured', async () => {
    const res = await requestScrambles(buildTestApp(), { event: '3x3', count: 1 })

    expect(res.status).toBe(503)
  })
})

describe('createScrambleGenerator', () => {
  const SLOW: FreePlayEvent[] = ['4x4', 'FTO']

  it('scrambles fast events inline, as many as asked', { timeout: 30_000 }, async () => {
    const slow = vi.fn(async (event: FreePlayEvent) => event)
    const generate = createScrambleGenerator(slow)

    for (const event of FREE_PLAY_EVENTS.filter((event) => !SLOW.includes(event))) {
      const scrambles = await generate(event, 2)
      expect(scrambles, event).toHaveLength(2)
      for (const scramble of scrambles) expect(scramble, event).toMatch(/\S/)
    }
    expect(slow).not.toHaveBeenCalled()
  })

  it('hands 4x4 and FTO to the slow scrambler one per call', async () => {
    const generate = createScrambleGenerator(async (event) => `${event} scramble`)

    expect(await generate('FTO', 4)).toEqual(['FTO scramble'])
    expect(await generate('4x4', 4)).toEqual(['4x4 scramble'])
  })
})

describe('createWorkerScrambler', () => {
  let dir: string

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'scrambles-worker-'))
    await build({
      entryPoints: [fileURLToPath(new URL('../src/modules/rooms/scrambles.worker.ts', import.meta.url))],
      outfile: join(dir, 'scrambles.worker.js'),
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node24',
      logLevel: 'silent'
    })
    await writeFile(
      join(dir, 'crashing.worker.mjs'),
      `import { parentPort } from 'node:worker_threads'
parentPort.on('message', ({ id, event }) => {
  if (event === 'FTO') throw new Error('trap')
  parentPort.postMessage({ id, scramble: event + ' scramble' })
})
`
    )
  })

  afterAll(() => rm(dir, { recursive: true, force: true }))

  it('generates random-state 4x4 and FTO on the bundled worker', { timeout: 30_000 }, async () => {
    const scramble = createWorkerScrambler(pathToFileURL(join(dir, 'scrambles.worker.js')))

    const [fto, four] = await Promise.all([scramble('FTO'), scramble('4x4')])
    for (const move of fto.split(' ')) expect(move).toMatch(/^(BR|BL|[RLBUDF])'?$/)
    for (const move of four.split(' ')) expect(move).toMatch(/^[RUFLDB]w?['2]?$/)
  })

  it('rejects the jobs of a crashed worker and starts a new one', async () => {
    const scramble = createWorkerScrambler(pathToFileURL(join(dir, 'crashing.worker.mjs')))

    const crashed = scramble('FTO')
    const queued = scramble('4x4')
    await expect(crashed).rejects.toThrow('trap')
    await expect(queued).rejects.toThrow('trap')
    await expect(scramble('4x4')).resolves.toBe('4x4 scramble')
  })
})
