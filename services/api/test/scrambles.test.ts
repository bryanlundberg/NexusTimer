import { FREE_PLAY_EVENTS, type FreePlayEvent } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { generateScrambles } from '../src/modules/rooms/scrambles.service'
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
      scrambles: (event, count) => {
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

describe('generateScrambles', () => {
  it('scrambles every free play event', { timeout: 30_000 }, () => {
    for (const event of FREE_PLAY_EVENTS) {
      const [scramble] = generateScrambles(event, 1)
      expect(scramble, event).toMatch(/\S/)
    }
  })

  it('makes one slow scramble per call and as many fast ones as asked', { timeout: 30_000 }, () => {
    expect(generateScrambles('FTO', 4)).toHaveLength(1)
    expect(generateScrambles('4x4', 4)).toHaveLength(1)
    expect(generateScrambles('2x2', 4)).toHaveLength(4)
  })
})
